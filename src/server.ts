import app from './app';
import './jobs/worker';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});