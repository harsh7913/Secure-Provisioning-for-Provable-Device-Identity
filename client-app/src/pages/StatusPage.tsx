import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import DashboardLayout from '../components/DashboardLayout';
import { useToast } from '../hooks/use-toast';

type JobStatus = 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

interface StatusData {
  deviceId: string;
  operatorId: number;
  status: JobStatus;
  cert: string;
  publicKey: string;
  error?: string;
  requestedAt: string;
  completedAt: string;
}

const StatusPage = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/status/${id}`);
        setData(res.data);
        if (res.data.status === 'COMPLETED' || res.data.status === 'FAILED') {
          clearInterval(interval);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load status');
        clearInterval(interval);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) return <DashboardLayout><p>⏳ Loading status...</p></DashboardLayout>;
  if (error) return <DashboardLayout><p className="text-red-600">❌ {error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Provisioning Status</h2>
        <div className="mb-2"><strong>Device ID:</strong> {data?.deviceId}</div>
        <div className="mb-2"><strong>Status:</strong> {data?.status}</div>
        <div className="mb-2"><strong>Requested At:</strong> {new Date(data!.requestedAt).toLocaleString()}</div>
        <div className="mb-4"><strong>Completed At:</strong> {new Date(data!.completedAt).toLocaleString()}</div>
        {data?.cert && (
          <div className="mb-4">
            <strong>Certificate:</strong>
            <pre className="bg-gray-100 text-xs p-2 rounded overflow-x-auto">
              {data.cert}
            </pre>
            <button onClick={() => copyToClipboard(data.cert)} className="text-blue-600 text-sm underline">Copy</button>
          </div>
        )}
        {data?.publicKey && (
          <div className="mb-4">
            <strong>Public Key:</strong>
            <pre className="bg-gray-100 text-xs p-2 rounded overflow-x-auto">
              {data.publicKey}
            </pre>
            <button onClick={() => copyToClipboard(data.publicKey)} className="text-blue-600 text-sm underline">Copy</button>
          </div>
        )}
        {data?.status === 'FAILED' && data.error && (
          <div className="text-red-700 bg-red-100 p-2 rounded">
            ❌ <strong>Error:</strong> {data.error}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StatusPage;