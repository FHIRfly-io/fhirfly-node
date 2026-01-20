/**
 * Response shape options for controlling the level of detail returned.
 */
export type ResponseShape = "compact" | "standard" | "full";

/**
 * Include options for additional data in responses.
 */
export type IncludeOption = "display";

/**
 * Common options for all lookup methods.
 */
export interface LookupOptions {
  /** Response detail level. Default: "standard" */
  shape?: ResponseShape;
  /** Include additional fields like pre-formatted display strings */
  include?: IncludeOption[];
}

/**
 * Common options for batch lookup methods.
 */
export interface BatchLookupOptions extends LookupOptions {
  /** Maximum codes per batch (default: 100, max: 500) */
  batchSize?: number;
}

/**
 * Legal/licensing information included in responses.
 */
export interface LegalInfo {
  license: string;
  attribution?: string;
  source_url?: string;
}

/**
 * Metadata included in all API responses.
 */
export interface ResponseMeta {
  legal: LegalInfo;
  shape: ResponseShape;
  api_version: string;
}

/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T> {
  data: T;
  meta: ResponseMeta;
}

/**
 * Batch response item - either success or not found.
 */
export interface BatchResultItem<T> {
  code: string;
  found: boolean;
  data?: T;
  error?: string;
}

/**
 * Batch response wrapper.
 */
export interface BatchResponse<T> {
  results: BatchResultItem<T>[];
  meta: ResponseMeta & {
    total: number;
    found: number;
    not_found: number;
  };
}

/**
 * Display field that may be included when include=display is specified.
 */
export interface DisplayField {
  display?: string;
}
