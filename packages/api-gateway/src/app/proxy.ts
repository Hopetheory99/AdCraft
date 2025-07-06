import { INestApplication } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function applyServiceProxies(app: INestApplication) {
  const routes = process.env.SERVICE_ROUTES;
  if (!routes) return;
  for (const pair of routes.split(',')) {
    const [prefix, target] = pair.split('=');
    if (!prefix || !target) continue;
    app.use(
      `/api/${prefix}`,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(new RegExp(`^/api/${prefix}`), ''),
      })
    );
  }
}

