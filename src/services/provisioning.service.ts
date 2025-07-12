interface AuditEntry {
  deviceId: string;
  operatorId: string;
  cert: string;
  publicKey: string;
  privateKey: string;
}

export async function saveAuditLog(entry: AuditEntry) {
  // For now, just log it; replace with DB logic later
  console.log('AUDIT_LOG:', entry);
}