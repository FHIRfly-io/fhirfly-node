import type { HttpClient } from "../http.js";
import type {
  ApiResponse,
  BatchResponse,
  LookupOptions,
  BatchLookupOptions,
  SearchOptions,
  SearchResponse,
} from "../types/common.js";
import type { Icd10Data, Icd10SearchParams } from "../types/icd10.js";

/**
 * ICD-10 API endpoint.
 */
export class Icd10Endpoint {
  constructor(private readonly http: HttpClient) {}

  /**
   * Look up a single ICD-10-CM code (diagnoses).
   *
   * @param code - ICD-10-CM code (e.g., "E11.9")
   * @param options - Response shape and include options
   * @returns ICD-10 data
   *
   * @example
   * ```ts
   * const icd = await client.icd10.lookupCm("E11.9");
   * console.log(icd.data.description); // "Type 2 diabetes mellitus without complications"
   * ```
   */
  async lookupCm(code: string, options?: LookupOptions): Promise<ApiResponse<Icd10Data>> {
    return this.http.get<ApiResponse<Icd10Data>>(`/v1/icd10/cm/${encodeURIComponent(code)}`, options);
  }

  /**
   * Look up a single ICD-10-PCS code (procedures).
   *
   * @param code - ICD-10-PCS code (e.g., "0BJ08ZZ")
   * @param options - Response shape and include options
   * @returns ICD-10 data
   *
   * @example
   * ```ts
   * const icd = await client.icd10.lookupPcs("0BJ08ZZ");
   * console.log(icd.data.description);
   * ```
   */
  async lookupPcs(code: string, options?: LookupOptions): Promise<ApiResponse<Icd10Data>> {
    return this.http.get<ApiResponse<Icd10Data>>(`/v1/icd10/pcs/${encodeURIComponent(code)}`, options);
  }

  /**
   * Look up multiple ICD-10-CM codes in a single request.
   *
   * @param codes - Array of ICD-10-CM codes (max 500)
   * @param options - Response shape, include, and batch options
   * @returns Batch response with results for each code
   */
  async lookupCmMany(
    codes: string[],
    options?: BatchLookupOptions
  ): Promise<BatchResponse<Icd10Data>> {
    return this.http.post<BatchResponse<Icd10Data>>(
      "/v1/icd10/cm/_batch",
      { codes },
      options
    );
  }

  /**
   * Look up multiple ICD-10-PCS codes in a single request.
   *
   * @param codes - Array of ICD-10-PCS codes (max 500)
   * @param options - Response shape, include, and batch options
   * @returns Batch response with results for each code
   */
  async lookupPcsMany(
    codes: string[],
    options?: BatchLookupOptions
  ): Promise<BatchResponse<Icd10Data>> {
    return this.http.post<BatchResponse<Icd10Data>>(
      "/v1/icd10/pcs/_batch",
      { codes },
      options
    );
  }

  /**
   * Search for ICD-10 codes (both CM and PCS).
   *
   * @param params - Search parameters (q, code_system, chapter, billable, etc.)
   * @param options - Pagination and response shape options
   * @returns Search results with facets
   *
   * @example
   * ```ts
   * // Search diagnosis codes
   * const results = await client.icd10.search({
   *   q: "diabetes",
   *   code_system: "CM",
   *   billable: true
   * });
   *
   * // Search procedure codes
   * const results = await client.icd10.search({
   *   q: "bypass",
   *   code_system: "PCS"
   * });
   * ```
   */
  async search(
    params: Icd10SearchParams,
    options?: SearchOptions
  ): Promise<SearchResponse<Icd10Data>> {
    return this.http.search<SearchResponse<Icd10Data>>("/v1/icd10/search", {
      ...params,
      ...options,
      include: options?.include?.join(","),
    });
  }
}
