import express from 'express';
import cors from 'cors';
import provisionRoutes from './api/provision.routes';
import { verifyJWT } from './utils/auth';
import statusRoutes from './api/status.routes';
import adminLogsRoutes from './api/admin/logs.routes';
import loginRoutes from './api/login.routes';

const app = express();
app.use(express.json());

// ✅ Add CORS middleware BEFORE routes
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ Now register your routes
app.use('/api/provision', verifyJWT, provisionRoutes);
app.use('/api', statusRoutes);
app.use('/api', adminLogsRoutes);
app.use('/api', loginRoutes);

export default app;
