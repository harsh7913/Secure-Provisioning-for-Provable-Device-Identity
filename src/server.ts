import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import './jobs/worker';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});