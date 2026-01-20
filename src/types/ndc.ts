import type { DisplayField } from "./common.js";

/**
 * Active ingredient in a drug product.
 */
export interface ActiveIngredient {
  name: string;
  strength?: string;
  unit?: string;
}

/**
 * Packaging information for an NDC.
 */
export interface NdcPackaging {
  ndc: string;
  description?: string;
  package_ndc?: string;
}

/**
 * NDC lookup result - compact shape.
 */
export interface NdcCompact extends DisplayField {
  ndc: string;
  ndc11: string;
  product_name: string;
  labeler_name: string;
}

/**
 * NDC lookup result - standard shape.
 */
export interface NdcStandard extends NdcCompact {
  generic_name?: string;
  dosage_form?: string;
  route?: string;
  active_ingredients: ActiveIngredient[];
  dea_schedule?: string;
  marketing_status?: string;
}

/**
 * NDC lookup result - full shape.
 */
export interface NdcFull extends NdcStandard {
  application_number?: string;
  product_type?: string;
  marketing_start_date?: string;
  marketing_end_date?: string;
  listing_expiration_date?: string;
  pharm_class?: string[];
  packaging?: NdcPackaging[];
}

/**
 * NDC response type based on shape.
 */
export type NdcData = NdcCompact | NdcStandard | NdcFull;
