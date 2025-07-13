import { IHSM } from './IHSM';

export class ProductionHSM implements IHSM {
  async provisionDevice(deviceId: string) {
    // NOTE: This is a stub for assignment purposes.
    // In production, this would call real HSM APIs to generate and sign keys.

    return {
      cert: `-----BEGIN CERTIFICATE-----\nPRODUCTION-MOCK-CERT-FOR-${deviceId}\n-----END CERTIFICATE-----`,
      publicKey: `PRODUCTION-MOCK-PUBLIC-KEY-FOR-${deviceId}`,
      privateKey: `PRODUCTION-MOCK-PRIVATE-KEY-FOR-${deviceId}`, // returned once, never stored
    };
  }
}
