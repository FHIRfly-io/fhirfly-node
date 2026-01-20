import type { HttpClient } from "../http.js";
import type {
  ApiResponse,
  BatchResponse,
  LookupOptions,
  BatchLookupOptions,
} from "../types/common.js";
import type { CvxData } from "../types/cvx.js";

/**
 * CVX (Vaccine Codes) API endpoint.
 */
export class CvxEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Look up a single CVX code.
   *
   * @param cvxCode - CVX vaccine code
   * @param options - Response shape and include options
   * @returns CVX data
   *
   * @example
   * ```ts
   * const cvx = await client.cvx.lookup("208");
   * console.log(cvx.data.short_description); // "COVID-19, mRNA, LNP-S, PF, 30 mcg/0.3 mL dose"
   * ```
   */
  async lookup(cvxCode: string, options?: LookupOptions): Promise<ApiResponse<CvxData>> {
    return this.http.get<ApiResponse<CvxData>>(`/v1/cvx/${encodeURIComponent(cvxCode)}`, options);
  }

  /**
   * Look up multiple CVX codes in a single request.
   *
   * @param cvxCodes - Array of CVX codes (max 500)
   * @param options - Response shape, include, and batch options
   * @returns Batch response with results for each code
   */
  async lookupMany(
    cvxCodes: string[],
    options?: BatchLookupOptions
  ): Promise<BatchResponse<CvxData>> {
    return this.http.post<BatchResponse<CvxData>>(
      "/v1/cvx/_batch",
      { codes: cvxCodes },
      options
    );
  }
}
