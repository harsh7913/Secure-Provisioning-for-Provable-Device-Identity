import { IHSM } from './IHSM';

export class ProductionHSM implements IHSM {
  async provisionDevice(deviceId: string) {
    // TODO: Implement real HSM logic here
    throw new Error('ProductionHSM not implemented yet');
  }
}