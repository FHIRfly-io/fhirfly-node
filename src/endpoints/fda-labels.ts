import type { HttpClient } from "../http.js";
import type {
  ApiResponse,
  BatchResponse,
  LookupOptions,
  BatchLookupOptions,
  SearchOptions,
  SearchResponse,
} from "../types/common.js";
import type { FdaLabelData, FdaLabelSearchParams } from "../types/fda-labels.js";

/**
 * FDA Labels API endpoint.
 */
export class FdaLabelsEndpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Look up FDA label by Set ID.
   *
   * @param setId - FDA SPL Set ID
   * @param options - Response shape and include options
   * @returns FDA Label data
   *
   * @example
   * ```ts
   * const label = await client.fdaLabels.lookup("abc123-def456");
   * console.log(label.data.indications_and_usage);
   * ```
   */
  async lookup(setId: string, options?: LookupOptions): Promise<ApiResponse<FdaLabelData>> {
    return this.http.get<ApiResponse<FdaLabelData>>(`/v1/fda-labels/${encodeURIComponent(setId)}`, options);
  }

  /**
   * Look up FDA label by NDC code.
   *
   * @param ndc - NDC code
   * @param options - Response shape and include options
   * @returns FDA Label data
   *
   * @example
   * ```ts
   * const label = await client.fdaLabels.lookupByNdc("0069-0151-01");
   * console.log(label.data.product_name);
   * ```
   */
  async lookupByNdc(ndc: string, options?: LookupOptions): Promise<ApiResponse<FdaLabelData>> {
    return this.http.get<ApiResponse<FdaLabelData>>(`/v1/fda-labels/ndc/${encodeURIComponent(ndc)}`, options);
  }

  /**
   * Look up multiple FDA labels by Set IDs in a single request.
   *
   * @param setIds - Array of Set IDs (max 500)
   * @param options - Response shape, include, and batch options
   * @returns Batch response with results for each Set ID
   */
  async lookupMany(
    setIds: string[],
    options?: BatchLookupOptions
  ): Promise<BatchResponse<FdaLabelData>> {
    return this.http.post<BatchResponse<FdaLabelData>>(
      "/v1/fda-labels/_batch",
      { codes: setIds },
      options
    );
  }

  /**
   * Search for FDA drug labels.
   *
   * @param params - Search parameters (q, name, brand, substance, manufacturer, etc.)
   * @param options - Pagination and response shape options
   * @returns Search results with facets
   *
   * @example
   * ```ts
   * // Search by drug name
   * const results = await client.fdaLabels.search({ q: "advil" });
   *
   * // Search OTC pain relievers
   * const results = await client.fdaLabels.search({
   *   substance: "acetaminophen",
   *   product_type: "otc"
   * });
   *
   * // Search by manufacturer
   * const results = await client.fdaLabels.search({
   *   manufacturer: "pfizer",
   *   product_type: "rx"
   * });
   * ```
   */
  async search(
    params: FdaLabelSearchParams,
    options?: SearchOptions
  ): Promise<SearchResponse<FdaLabelData>> {
    return this.http.search<SearchResponse<FdaLabelData>>("/v1/fda-label/search", {
      ...params,
      ...options,
      include: options?.include?.join(","),
    });
  }
}
