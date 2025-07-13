import express from 'express';
import provisionRoutes from './api/provision.routes';
import { verifyJWT } from './utils/auth';
import statusRoutes from './api/status.routes';
import adminLogsRoutes from './api/admin/logs.routes';

const app = express();
app.use(express.json());

// Protect all routes
app.use('/api/provision', verifyJWT, provisionRoutes);
app.use('/api', statusRoutes);
app.use('/api', adminLogsRoutes);

export default app;