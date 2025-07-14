import { useEffect, useState } from 'react';
import api from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { useToast } from '../hooks/use-toast';

type JobStatus = 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

interface LogEntry {
  id: number;
  deviceId: string;
  operatorId: number;
  operatorName: string;
  status: JobStatus;
  requestedAt: string;
  completedAt: string;
  cert: string;
  publicKey: string;
  error?: string;
}

const DashboardPage = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [deviceId, setDeviceId] = useState('');
  const [status, setStatus] = useState('');
  const toast = useToast();

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/logs', {
        params: { deviceId, status },
      });
      setLogs(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to fetch logs');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Provisioning Logs</h2>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by Device ID"
            className="border px-4 py-2 rounded w-64"
            value={deviceId}
            onChange={e => setDeviceId(e.target.value)}
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Status</option>
            <option value="QUEUED">QUEUED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="FAILED">FAILED</option>
          </select>
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
            onClick={fetchLogs}
          >
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Device ID</th>
                <th className="p-2 border">Operator</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Requested</th>
                <th className="p-2 border">Completed</th>
                <th className="p-2 border">Cert</th>
                <th className="p-2 border">Public Key</th>
                <th className="p-2 border">Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td className="p-2 border">{log.deviceId}</td>
                  <td className="p-2 border">{log.operatorName} (#{log.operatorId})</td>
                  <td className="p-2 border">{log.status}</td>
                  <td className="p-2 border">{new Date(log.requestedAt).toLocaleString()}</td>
                  <td className="p-2 border">{new Date(log.completedAt).toLocaleString()}</td>
                  <td className="p-2 border text-xs truncate max-w-[100px]">{log.cert.slice(0, 30)}...</td>
                  <td className="p-2 border text-xs truncate max-w-[100px]">{log.publicKey.slice(0, 30)}...</td>
                  <td className="p-2 border text-xs text-red-600">{log.error || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
