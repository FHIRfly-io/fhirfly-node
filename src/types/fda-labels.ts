import type { DisplayField } from "./common.js";

/**
 * FDA Label lookup result - compact shape.
 */
export interface FdaLabelCompact extends DisplayField {
  set_id: string;
  product_name: string;
  labeler_name: string;
}

/**
 * FDA Label lookup result - standard shape.
 */
export interface FdaLabelStandard extends FdaLabelCompact {
  version?: number;
  effective_time?: string;
  product_type?: string;
  route?: string[];
  substance_name?: string[];
  indications_and_usage?: string;
  dosage_and_administration?: string;
}

/**
 * FDA Label lookup result - full shape.
 */
export interface FdaLabelFull extends FdaLabelStandard {
  spl_id?: string;
  document_type?: string;
  warnings?: string;
  precautions?: string;
  contraindications?: string;
  adverse_reactions?: string;
  drug_interactions?: string;
  overdosage?: string;
  clinical_pharmacology?: string;
  mechanism_of_action?: string;
  pharmacodynamics?: string;
  pharmacokinetics?: string;
  how_supplied?: string;
  storage_and_handling?: string;
  boxed_warning?: string;
  pregnancy?: string;
  nursing_mothers?: string;
  pediatric_use?: string;
  geriatric_use?: string;
}

/**
 * FDA Label response type based on shape.
 */
export type FdaLabelData = FdaLabelCompact | FdaLabelStandard | FdaLabelFull;
