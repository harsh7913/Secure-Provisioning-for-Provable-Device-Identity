import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/status/${id}`);
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  if (loading) return <p className="text-center mt-10">⏳ Loading status...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">❌ {error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Provisioning Status</h2>

      <div className="mb-2">
        <strong>Device ID:</strong> {data?.deviceId}
      </div>
      <div className="mb-2">
        <strong>Status:</strong> {data?.status}
      </div>
      <div className="mb-2">
        <strong>Requested At:</strong> {new Date(data!.requestedAt).toLocaleString()}
      </div>
      <div className="mb-4">
        <strong>Completed At:</strong> {new Date(data!.completedAt).toLocaleString()}
      </div>

      {data?.cert && (
        <div className="mb-4">
          <strong>Certificate:</strong>
          <pre className="bg-gray-100 text-xs p-2 rounded overflow-x-auto">
            {data.cert}
          </pre>
        </div>
      )}

      {data?.publicKey && (
        <div className="mb-4">
          <strong>Public Key:</strong>
          <pre className="bg-gray-100 text-xs p-2 rounded overflow-x-auto">
            {data.publicKey}
          </pre>
        </div>
      )}

      {data?.status === 'FAILED' && data.error && (
        <div className="text-red-700 bg-red-100 p-2 rounded">
          ❌ <strong>Error:</strong> {data.error}
        </div>
      )}
    </div>
  );
};

export default StatusPage;
