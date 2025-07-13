import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = Router();
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || 'dev_secret';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, role: user.role.toLowerCase() }, SECRET, { expiresIn: '1h' });

  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

export default router;
