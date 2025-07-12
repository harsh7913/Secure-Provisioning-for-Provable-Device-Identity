import { IHSM } from './IHSM';

export class MockHSM implements IHSM {
  async provisionDevice(deviceId: string) {
    return {
      cert: `CERTIFICATE_FOR_${deviceId}`,
      publicKey: `PUBLIC_KEY_FOR_${deviceId}`,
      privateKey: `PRIVATE_KEY_FOR_${deviceId}`,
    };
  }
}