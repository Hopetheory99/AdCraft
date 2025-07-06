import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

export function createJwtMiddleware(jwtService: JwtService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // allow unauthenticated access to auth routes
    if (req.path.startsWith('/api/auth')) {
      return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.slice(7);
    try {
      const payload = await jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'secret',
      });
      (req as any).user = payload;
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
