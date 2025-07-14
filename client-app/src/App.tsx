import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProvisionPage from './pages/ProvisionPage';
import StatusPage from './pages/StatusPage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/provision" element={<ProvisionPage />} />
        <Route path="/status/:id" element={<StatusPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/provision" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);
export default App;