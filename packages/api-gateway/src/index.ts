import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.replace('Bearer ', '');
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

app.use('/auth', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/assets', authMiddleware, createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));
app.use('/ads', authMiddleware, createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));
app.use('/templates', authMiddleware, createProxyMiddleware({ target: 'http://localhost:3004', changeOrigin: true }));

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ message: 'Gateway error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API Gateway running on ${port}`));

export default app;
