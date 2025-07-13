import { IHSM } from './IHSM';
import crypto from 'crypto';

export class MockHSM implements IHSM {
  async provisionDevice(deviceId: string) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });

    // self-signed certificate (for assignment)
    const cert = `-----BEGIN CERTIFICATE-----\nMOCK-CERTIFICATE-FOR-${deviceId}\n-----END CERTIFICATE-----`;

    return {
      cert,
      publicKey,
      privateKey,
    };
  }
}
