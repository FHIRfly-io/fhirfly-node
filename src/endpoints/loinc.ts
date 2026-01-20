import type { HttpClient } from "../http.js";
import type {
  ApiResponse,
  BatchResponse,
  LookupOptions,
  BatchLookupOptions,
} from "../types/common.js";
import type { LoincData } from "../types/loinc.js";

/**
 * LOINC API endpoint.
 */
export class LoincEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Look up a single LOINC code.
   *
   * @param loincNum - LOINC number (e.g., "2345-7")
   * @param options - Response shape and include options
   * @returns LOINC data
   *
   * @example
   * ```ts
   * const loinc = await client.loinc.lookup("2345-7");
   * console.log(loinc.data.long_common_name); // "Glucose [Mass/volume] in Serum or Plasma"
   * ```
   */
  async lookup(loincNum: string, options?: LookupOptions): Promise<ApiResponse<LoincData>> {
    return this.http.get<ApiResponse<LoincData>>(`/v1/loinc/${encodeURIComponent(loincNum)}`, options);
  }

  /**
   * Look up multiple LOINC codes in a single request.
   *
   * @param loincNums - Array of LOINC numbers (max 500)
   * @param options - Response shape, include, and batch options
   * @returns Batch response with results for each LOINC
   */
  async lookupMany(
    loincNums: string[],
    options?: BatchLookupOptions
  ): Promise<BatchResponse<LoincData>> {
    return this.http.post<BatchResponse<LoincData>>(
      "/v1/loinc/_batch",
      { codes: loincNums },
      options
    );
  }
}
