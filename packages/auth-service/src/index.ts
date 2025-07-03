import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());

const users: any[] = [];
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function generateTokens(user: any) {
  const payload = { sub: user.id, email: user.email };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, password: hashed };
  users.push(user);
  res.json({ user: { id: user.id, email: user.email }, tokens: generateTokens(user) });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ user: { id: user.id, email: user.email }, tokens: generateTokens(user) });
});

app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as any;
    const user = users.find(u => u.id === payload.sub);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    res.json({ tokens: generateTokens(user) });
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/users', (_req, res) => {
  res.json(users.map(u => ({ id: u.id, email: u.email })));
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Auth service running on ${port}`));

export default app;
