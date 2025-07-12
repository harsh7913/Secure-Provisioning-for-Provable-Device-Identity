import express from 'express';
import provisionRoutes from './api/provision.routes';
import { verifyJWT } from './utils/auth';

const app = express();
app.use(express.json());

// Protect all routes
app.use('/api/provision', verifyJWT, provisionRoutes);

export default app;