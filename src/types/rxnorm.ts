import type { DisplayField } from "./common.js";

/**
 * RxNorm term type (TTY).
 */
export type RxTermType =
  | "IN"    // Ingredient
  | "PIN"   // Precise Ingredient
  | "MIN"   // Multiple Ingredients
  | "SCDC"  // Semantic Clinical Drug Component
  | "SCDF"  // Semantic Clinical Drug Form
  | "SCDG"  // Semantic Clinical Dose Form Group
  | "SCD"   // Semantic Clinical Drug
  | "GPCK"  // Generic Pack
  | "BN"    // Brand Name
  | "SBDC"  // Semantic Branded Drug Component
  | "SBDF"  // Semantic Branded Drug Form
  | "SBDG"  // Semantic Branded Dose Form Group
  | "SBD"   // Semantic Branded Drug
  | "BPCK"  // Brand Name Pack
  | "PSN"   // Prescribable Name
  | "SY"    // Synonym
  | "TMSY"  // Tall Man Lettering Synonym
  | "DF"    // Dose Form
  | "ET"    // Entry Term
  | "DFG";  // Dose Form Group

/**
 * RxNorm lookup result - compact shape.
 */
export interface RxNormCompact extends DisplayField {
  rxcui: string;
  name: string;
  tty: RxTermType;
}

/**
 * RxNorm lookup result - standard shape.
 */
export interface RxNormStandard extends RxNormCompact {
  synonym?: string;
  suppress?: string;
  language?: string;
  prescribable?: boolean;
  ingredients?: Array<{
    rxcui: string;
    name: string;
  }>;
}

/**
 * RxNorm lookup result - full shape.
 */
export interface RxNormFull extends RxNormStandard {
  dose_form?: {
    rxcui: string;
    name: string;
  };
  brands?: Array<{
    rxcui: string;
    name: string;
  }>;
  related?: Array<{
    rxcui: string;
    name: string;
    tty: RxTermType;
    relation: string;
  }>;
  ndcs?: string[];
}

/**
 * RxNorm response type based on shape.
 */
export type RxNormData = RxNormCompact | RxNormStandard | RxNormFull;
