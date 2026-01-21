import { describe, it, expect } from "vitest";
import { Fhirfly } from "../src/index.js";

describe("Fhirfly", () => {
  it("throws if apiKey is missing", () => {
    expect(() => new Fhirfly({ apiKey: "" })).toThrow("API key is required");
  });

  it("creates client with valid config", () => {
    const client = new Fhirfly({ apiKey: "test-key" });
    expect(client).toBeDefined();
    expect(client.ndc).toBeDefined();
    expect(client.npi).toBeDefined();
  });
});
