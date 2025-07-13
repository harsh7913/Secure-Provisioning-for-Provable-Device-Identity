import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const ProvisioningPage = () => {
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await api.post('/provision', {
        deviceId,
        operatorId: user?.id,
      });

      setSuccess(true);
      setDeviceId('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Provisioning failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Provision Device</h2>

      <form onSubmit={handleProvision}>
        <label className="block mb-2 text-sm font-medium">Device ID</label>
        <input
          type="text"
          value={deviceId}
          onChange={e => setDeviceId(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? 'Provisioning...' : 'Provision'}
        </button>
      </form>

      {success && (
        <div className="mt-4 text-green-700 bg-green-100 p-2 rounded text-sm">
          ✅ Provisioned successfully.{' '}
          <button
            className="text-blue-600 underline ml-1"
            onClick={() => navigate(`/status/${deviceId}`)}
          >
            View Status
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-700 bg-red-100 p-2 rounded text-sm">
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default ProvisioningPage;
