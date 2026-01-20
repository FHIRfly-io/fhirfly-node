import type { DisplayField } from "./common.js";

/**
 * MVX vaccine manufacturer lookup result - compact shape.
 */
export interface MvxCompact extends DisplayField {
  mvx_code: string;
  manufacturer_name: string;
}

/**
 * MVX vaccine manufacturer lookup result - standard shape.
 */
export interface MvxStandard extends MvxCompact {
  notes?: string;
  status: "Active" | "Inactive";
  last_updated?: string;
}

/**
 * MVX vaccine manufacturer lookup result - full shape.
 */
export interface MvxFull extends MvxStandard {
  vaccines?: Array<{
    cvx_code: string;
    vaccine_name: string;
  }>;
}

/**
 * MVX response type based on shape.
 */
export type MvxData = MvxCompact | MvxStandard | MvxFull;
