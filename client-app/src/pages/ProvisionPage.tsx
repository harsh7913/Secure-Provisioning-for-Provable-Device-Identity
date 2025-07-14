import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import DashboardLayout from '../components/DashboardLayout';

const ProvisionPage = () => {
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/provision', { deviceId, operatorId: user?.id });
      toast.success(`✅ Provision started for ${deviceId}`);
      navigate(`/status/${deviceId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || '❌ Provisioning failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto">
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
      </div>
    </DashboardLayout>
  );
};

export default ProvisionPage;
