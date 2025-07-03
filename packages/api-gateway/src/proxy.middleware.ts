import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ServiceRegistry } from './service-registry';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(private registry: ServiceRegistry) {}
  use(req: Request, res: Response, next: NextFunction) {
    const [, service] = req.originalUrl.split('/');
    const target = this.registry.get(service || '');
    if (!target) return res.status(404).json({ message: 'Not Found' });
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^/${service}`]: '' },
    })(req, res, next);
  }
}
