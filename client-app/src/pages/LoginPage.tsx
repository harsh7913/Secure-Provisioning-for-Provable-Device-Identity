import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      const { token, user } = res.data;
      login(token, user);
      toast.success('✅ Login successful');
      navigate('/provision');
    } catch (err: any) {
      toast.error(err.response?.data?.error || '❌ Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Operator Login</h2>
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input type="email" className="w-full px-4 py-2 border rounded mb-4" value={email} onChange={e => setEmail(e.target.value)} required />
        <label className="block mb-2 text-sm font-medium">Password</label>
        <input type="password" className="w-full px-4 py-2 border rounded mb-6" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;