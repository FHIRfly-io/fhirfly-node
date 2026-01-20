import { HttpClient, type HttpClientConfig } from "./http.js";
import { NdcEndpoint } from "./endpoints/ndc.js";
import { NpiEndpoint } from "./endpoints/npi.js";
import { RxNormEndpoint } from "./endpoints/rxnorm.js";
import { LoincEndpoint } from "./endpoints/loinc.js";
import { Icd10Endpoint } from "./endpoints/icd10.js";
import { CvxEndpoint } from "./endpoints/cvx.js";
import { MvxEndpoint } from "./endpoints/mvx.js";
import { FdaLabelsEndpoint } from "./endpoints/fda-labels.js";

/**
 * Configuration options for the FHIRfly client.
 */
export interface FhirflyConfig {
  /**
   * Your FHIRfly API key.
   * Get one at https://fhirfly.io/dashboard
   */
  apiKey: string;

  /**
   * Base URL for the API.
   * @default "https://api.fhirfly.io"
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds.
   * @default 30000
   */
  timeout?: number;

  /**
   * Maximum number of retry attempts for failed requests.
   * @default 3
   */
  maxRetries?: number;

  /**
   * Base delay between retries in milliseconds (exponential backoff).
   * @default 1000
   */
  retryDelay?: number;
}

/**
 * FHIRfly API client.
 *
 * Provides access to healthcare reference data including drug codes (NDC, RxNorm),
 * provider identifiers (NPI), lab codes (LOINC), diagnosis codes (ICD-10),
 * vaccine codes (CVX, MVX), and FDA drug labels.
 *
 * @example
 * ```ts
 * import { Fhirfly } from "@fhirfly/sdk";
 *
 * const client = new Fhirfly({ apiKey: "your-api-key" });
 *
 * // Look up a drug by NDC
 * const ndc = await client.ndc.lookup("0069-0151-01");
 * console.log(ndc.data.product_name); // "Lipitor"
 *
 * // Look up a provider by NPI
 * const npi = await client.npi.lookup("1234567890");
 * console.log(npi.data.name);
 *
 * // Batch lookups
 * const results = await client.ndc.lookupMany([
 *   "0069-0151-01",
 *   "0069-0151-02"
 * ]);
 * ```
 */
export class Fhirfly {
  private readonly http: HttpClient;

  /**
   * NDC (National Drug Code) lookups.
   */
  readonly ndc: NdcEndpoint;

  /**
   * NPI (National Provider Identifier) lookups.
   */
  readonly npi: NpiEndpoint;

  /**
   * RxNorm drug terminology lookups.
   */
  readonly rxnorm: RxNormEndpoint;

  /**
   * LOINC laboratory and clinical observation code lookups.
   */
  readonly loinc: LoincEndpoint;

  /**
   * ICD-10 diagnosis and procedure code lookups.
   */
  readonly icd10: Icd10Endpoint;

  /**
   * CVX vaccine code lookups.
   */
  readonly cvx: CvxEndpoint;

  /**
   * MVX vaccine manufacturer code lookups.
   */
  readonly mvx: MvxEndpoint;

  /**
   * FDA drug label lookups.
   */
  readonly fdaLabels: FdaLabelsEndpoint;

  /**
   * Create a new FHIRfly client.
   *
   * @param config - Client configuration
   * @throws {Error} If apiKey is not provided
   */
  constructor(config: FhirflyConfig) {
    if (!config.apiKey) {
      throw new Error(
        "FHIRfly API key is required. Get one at https://fhirfly.io/dashboard"
      );
    }

    const httpConfig: HttpClientConfig = {
      baseUrl: config.baseUrl ?? "https://api.fhirfly.io",
      apiKey: config.apiKey,
      timeout: config.timeout,
      maxRetries: config.maxRetries,
      retryDelay: config.retryDelay,
    };

    this.http = new HttpClient(httpConfig);

    // Initialize endpoints
    this.ndc = new NdcEndpoint(this.http);
    this.npi = new NpiEndpoint(this.http);
    this.rxnorm = new RxNormEndpoint(this.http);
    this.loinc = new LoincEndpoint(this.http);
    this.icd10 = new Icd10Endpoint(this.http);
    this.cvx = new CvxEndpoint(this.http);
    this.mvx = new MvxEndpoint(this.http);
    this.fdaLabels = new FdaLabelsEndpoint(this.http);
  }
}
