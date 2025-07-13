import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ProvisioningPage from './components/ProvisioningPage';
import StatusPage from './components/StatusPage';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected operator routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/provision" element={<ProvisioningPage />} />
          <Route path="/status/:id" element={<StatusPage />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<p>404 - Not Found</p>} />
      </Routes>
    </Router>
  );
};

export default App;
