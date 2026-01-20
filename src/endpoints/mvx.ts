import type { HttpClient } from "../http.js";
import type {
  ApiResponse,
  BatchResponse,
  LookupOptions,
  BatchLookupOptions,
} from "../types/common.js";
import type { MvxData } from "../types/mvx.js";

/**
 * MVX (Vaccine Manufacturer Codes) API endpoint.
 */
export class MvxEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Look up a single MVX code.
   *
   * @param mvxCode - MVX manufacturer code
   * @param options - Response shape and include options
   * @returns MVX data
   *
   * @example
   * ```ts
   * const mvx = await client.mvx.lookup("PFR");
   * console.log(mvx.data.manufacturer_name); // "Pfizer, Inc"
   * ```
   */
  async lookup(mvxCode: string, options?: LookupOptions): Promise<ApiResponse<MvxData>> {
    return this.http.get<ApiResponse<MvxData>>(`/v1/mvx/${encodeURIComponent(mvxCode)}`, options);
  }

  /**
   * Look up multiple MVX codes in a single request.
   *
   * @param mvxCodes - Array of MVX codes (max 500)
   * @param options - Response shape, include, and batch options
   * @returns Batch response with results for each code
   */
  async lookupMany(
    mvxCodes: string[],
    options?: BatchLookupOptions
  ): Promise<BatchResponse<MvxData>> {
    return this.http.post<BatchResponse<MvxData>>(
      "/v1/mvx/_batch",
      { codes: mvxCodes },
      options
    );
  }
}
