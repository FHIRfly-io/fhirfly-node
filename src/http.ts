import {
  ApiError,
  AuthenticationError,
  NetworkError,
  NotFoundError,
  QuotaExceededError,
  RateLimitError,
  ServerError,
  TimeoutError,
  ValidationError,
} from "./errors.js";
import type { LookupOptions } from "./types/common.js";

/**
 * HTTP client configuration.
 */
export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  userAgent?: string;
}

/**
 * HTTP response from the API.
 */
interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

/**
 * Internal HTTP client for making API requests.
 */
export class HttpClient {
  private readonly config: Required<HttpClientConfig>;

  constructor(config: HttpClientConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      timeout: config.timeout ?? 30000,
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      userAgent: config.userAgent ?? `@fhirfly/sdk/0.1.0 Node.js/${process.version}`,
    };
  }

  /**
   * Build query string from options.
   */
  private buildQueryString(options?: LookupOptions): string {
    if (!options) return "";

    const params = new URLSearchParams();

    if (options.shape) {
      params.set("shape", options.shape);
    }

    if (options.include?.length) {
      params.set("include", options.include.join(","));
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }

  /**
   * Parse error response from API.
   */
  private async parseErrorResponse(
    response: Response,
    endpoint: string
  ): Promise<never> {
    const status = response.status;
    let body: { message?: string; code?: string; error?: string; details?: unknown } = {};

    try {
      body = await response.json() as typeof body;
    } catch {
      // Response body is not JSON
    }

    const message = body.message || body.error || response.statusText;

    // Handle specific status codes
    switch (status) {
      case 401:
        throw new AuthenticationError(message);

      case 404: {
        // Extract code type and value from endpoint
        const match = endpoint.match(/\/v1\/(\w+)\/(.+)/);
        if (match) {
          throw new NotFoundError(match[1]!.toUpperCase(), match[2]!);
        }
        throw new NotFoundError("Resource", endpoint);
      }

      case 400:
        throw new ValidationError(message);

      case 429: {
        const retryAfter = response.headers.get("retry-after");
        const limit = response.headers.get("x-ratelimit-limit");
        const remaining = response.headers.get("x-ratelimit-remaining");
        const reset = response.headers.get("x-ratelimit-reset");

        // Check if it's a quota error vs rate limit
        if (body.code === "QUOTA_EXCEEDED") {
          throw new QuotaExceededError(message);
        }

        throw new RateLimitError(
          message,
          retryAfter ? parseInt(retryAfter, 10) : undefined,
          limit ? parseInt(limit, 10) : undefined,
          remaining ? parseInt(remaining, 10) : undefined,
          reset ? new Date(parseInt(reset, 10) * 1000) : undefined
        );
      }

      default:
        if (status >= 500) {
          throw new ServerError(message, status);
        }
        throw new ApiError(message, status, body.code, body.details);
    }
  }

  /**
   * Sleep for a given number of milliseconds.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Make an HTTP request with retries.
   */
  private async request<T>(
    method: "GET" | "POST",
    endpoint: string,
    body?: unknown
  ): Promise<HttpResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout
        );

        const response = await fetch(url, {
          method,
          headers: {
            "Authorization": `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": this.config.userAgent,
            "Accept": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // Don't retry client errors (except rate limits)
          if (response.status < 500 && response.status !== 429) {
            await this.parseErrorResponse(response, endpoint);
          }

          // For rate limits, check retry-after header
          if (response.status === 429) {
            const retryAfter = response.headers.get("retry-after");
            if (retryAfter && attempt < this.config.maxRetries) {
              await this.sleep(parseInt(retryAfter, 10) * 1000);
              continue;
            }
            await this.parseErrorResponse(response, endpoint);
          }

          // Retry server errors
          if (attempt < this.config.maxRetries) {
            await this.sleep(this.config.retryDelay * Math.pow(2, attempt));
            continue;
          }

          await this.parseErrorResponse(response, endpoint);
        }

        const data = await response.json() as T;
        return { data, status: response.status, headers: response.headers };
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            throw new TimeoutError(this.config.timeout);
          }

          lastError = error;

          // Retry on network errors
          if (attempt < this.config.maxRetries) {
            await this.sleep(this.config.retryDelay * Math.pow(2, attempt));
            continue;
          }
        }

        throw new NetworkError(
          lastError?.message || "Unknown network error",
          lastError
        );
      }
    }

    throw new NetworkError(
      lastError?.message || "Request failed after retries",
      lastError
    );
  }

  /**
   * Make a GET request.
   */
  async get<T>(endpoint: string, options?: LookupOptions): Promise<T> {
    const queryString = this.buildQueryString(options);
    const response = await this.request<T>("GET", `${endpoint}${queryString}`);
    return response.data;
  }

  /**
   * Make a POST request.
   */
  async post<T>(endpoint: string, body: unknown, options?: LookupOptions): Promise<T> {
    const queryString = this.buildQueryString(options);
    const response = await this.request<T>("POST", `${endpoint}${queryString}`, body);
    return response.data;
  }
}
