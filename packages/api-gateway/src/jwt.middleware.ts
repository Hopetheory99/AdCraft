import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/auth')) {
      return next();
    }
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.replace('Bearer ', '');
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'secret');
      next();
    } catch {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
