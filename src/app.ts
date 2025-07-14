import express from 'express';
import cors from 'cors';
import provisionRoutes from './api/provision.routes';
import { verifyJWT } from './utils/auth';
import statusRoutes from './api/status.routes';
import adminLogsRoutes from './api/admin/logs.routes';
import loginRoutes from './api/login.routes';

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174'
];

// ✅ Add CORS middleware BEFORE routes
const corsOptions = {
  origin:  function (origin : any, callback : any) {
    // allow requests with no origin (like Postman, mobile apps, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
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
