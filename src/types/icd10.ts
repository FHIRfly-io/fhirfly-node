import type { DisplayField } from "./common.js";

/**
 * ICD-10 code type.
 */
export type Icd10Type = "cm" | "pcs";

/**
 * ICD-10 lookup result - compact shape.
 */
export interface Icd10Compact extends DisplayField {
  code: string;
  type: Icd10Type;
  description: string;
}

/**
 * ICD-10 lookup result - standard shape.
 */
export interface Icd10Standard extends Icd10Compact {
  long_description?: string;
  chapter?: string;
  chapter_description?: string;
  section?: string;
  section_description?: string;
  billable?: boolean;
  /** ICD-10-CM specific */
  is_header?: boolean;
  /** ICD-10-PCS specific */
  body_system?: string;
  root_operation?: string;
}

/**
 * ICD-10 lookup result - full shape.
 */
export interface Icd10Full extends Icd10Standard {
  /** ICD-10-CM specific */
  includes?: string[];
  excludes1?: string[];
  excludes2?: string[];
  code_first?: string[];
  use_additional?: string[];
  /** ICD-10-PCS specific */
  approach?: string;
  device?: string;
  qualifier?: string;
  /** Effective dates */
  effective_date?: string;
  end_date?: string;
}

/**
 * ICD-10 response type based on shape.
 */
export type Icd10Data = Icd10Compact | Icd10Standard | Icd10Full;
