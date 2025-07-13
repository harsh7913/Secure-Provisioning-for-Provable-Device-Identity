export interface IHSM {
  provisionDevice(deviceId: string): Promise<{
    cert: string;
    publicKey: string;
  }>;
}
