import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="font-semibold text-lg">🔐 Secure Operator Panel</div>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block">{user?.name}</span>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-sm underline hover:text-accent"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-grow p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;