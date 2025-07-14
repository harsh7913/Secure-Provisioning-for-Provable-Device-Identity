import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || 'dev_secret';

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('📨 Incoming login request:', email);

  if (!email || !password) {
    console.log('❌ Missing credentials');
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('❌ User not found');
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    console.log('❌ Password mismatch');
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, role: user.role.toLowerCase() }, SECRET, { expiresIn: '1h' });
  console.log('✅ Login successful for', user.email);

  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});


export default router;
