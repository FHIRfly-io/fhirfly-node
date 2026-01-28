import type { DisplayField } from "./common.js";

/**
 * CVX vaccine code lookup result - compact shape.
 */
export interface CvxCompact extends DisplayField {
  cvx_code: string;
  short_description: string;
}

/**
 * CVX vaccine code lookup result - standard shape.
 */
export interface CvxStandard extends CvxCompact {
  full_vaccine_name: string;
  notes?: string;
  status: "Active" | "Inactive" | "Never Active" | "Pending";
  last_updated?: string;
}

/**
 * CVX vaccine code lookup result - full shape.
 */
export interface CvxFull extends CvxStandard {
  vaccine_group?: string;
  cdc_product_name?: string;
  dose_number?: string;
  forecast_vaccine_group?: string;
}

/**
 * CVX response type based on shape.
 */
export type CvxData = CvxCompact | CvxStandard | CvxFull;

/**
 * CVX search parameters.
 */
export interface CvxSearchParams {
  /** General text search */
  q?: string;
  /** Filter by status: "active", "inactive" */
  status?: string;
  /** Filter by vaccine type (e.g., "mRNA", "live", "inactivated") */
  vaccine_type?: string;
  /** Filter for COVID-19 vaccines only */
  is_covid_vaccine?: boolean;
  /** Sort order: "relevance", "name", "code" */
  sort?: "relevance" | "name" | "code";
}
