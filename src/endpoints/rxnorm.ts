import type { HttpClient } from "../http.js";
import type {
  ApiResponse,
  BatchResponse,
  LookupOptions,
  BatchLookupOptions,
} from "../types/common.js";
import type { RxNormData } from "../types/rxnorm.js";

/**
 * RxNorm API endpoint.
 */
export class RxNormEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Look up a single RxCUI.
   *
   * @param rxcui - RxNorm Concept Unique Identifier
   * @param options - Response shape and include options
   * @returns RxNorm data
   *
   * @example
   * ```ts
   * const rx = await client.rxnorm.lookup("213169");
   * console.log(rx.data.name); // "atorvastatin 10 MG Oral Tablet"
   * ```
   */
  async lookup(rxcui: string, options?: LookupOptions): Promise<ApiResponse<RxNormData>> {
    return this.http.get<ApiResponse<RxNormData>>(`/v1/rxnorm/${encodeURIComponent(rxcui)}`, options);
  }

  /**
   * Look up multiple RxCUIs in a single request.
   *
   * @param rxcuis - Array of RxCUIs (max 500)
   * @param options - Response shape, include, and batch options
   * @returns Batch response with results for each RxCUI
   */
  async lookupMany(
    rxcuis: string[],
    options?: BatchLookupOptions
  ): Promise<BatchResponse<RxNormData>> {
    return this.http.post<BatchResponse<RxNormData>>(
      "/v1/rxnorm/_batch",
      { codes: rxcuis },
      options
    );
  }
}
