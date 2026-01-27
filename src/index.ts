/**
 * @fhirfly/sdk - Official FHIRfly SDK for Node.js
 *
 * Healthcare reference data APIs for clinical coding, drug information, and provider lookup.
 *
 * @packageDocumentation
 */

// Main client
export { Fhirfly, type FhirflyConfig, type FhirflyApiKeyConfig, type FhirflyOAuthConfig } from "./client.js";

// Auth utilities
export { TokenManager } from "./http.js";

// Errors
export {
  FhirflyError,
  ApiError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  QuotaExceededError,
  ServerError,
  NetworkError,
  TimeoutError,
} from "./errors.js";

// Types
export type {
  // Common
  ResponseShape,
  IncludeOption,
  LookupOptions,
  BatchLookupOptions,
  LegalInfo,
  ResponseMeta,
  ApiResponse,
  BatchResultItem,
  BatchResponse,
  DisplayField,
  // NDC
  ActiveIngredient,
  NdcPackaging,
  NdcCompact,
  NdcStandard,
  NdcFull,
  NdcData,
  // NPI
  NpiAddress,
  NpiTaxonomy,
  NpiIdentifier,
  NpiCompact,
  NpiStandard,
  NpiFull,
  NpiData,
  // RxNorm
  RxTermType,
  RxNormCompact,
  RxNormStandard,
  RxNormFull,
  RxNormData,
  // LOINC
  LoincCompact,
  LoincStandard,
  LoincFull,
  LoincData,
  // ICD-10
  Icd10Type,
  Icd10Compact,
  Icd10Standard,
  Icd10Full,
  Icd10Data,
  // CVX
  CvxCompact,
  CvxStandard,
  CvxFull,
  CvxData,
  // MVX
  MvxCompact,
  MvxStandard,
  MvxFull,
  MvxData,
  // FDA Labels
  FdaLabelCompact,
  FdaLabelStandard,
  FdaLabelFull,
  FdaLabelData,
} from "./types/index.js";
