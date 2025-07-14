import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'dev_secret';

// Admin login route
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('📨 Incoming admin login request:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Invalid credentials or role' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role.toLowerCase() },
    SECRET,
    { expiresIn: '1h' }
  );

  console.log('✅ Admin login successful for', user.email);

  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// Operator login route
router.post('/operator/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('📨 Incoming operator login request:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== 'OPERATOR') {
    console.log('❌ Invalid operator login attempt');
    return res.status(401).json({ error: 'Invalid credentials or role' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role.toLowerCase() },
    SECRET,
    { expiresIn: '1h' }
  );

  console.log('✅ Operator login successful for', user.email);

  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

export default router;
