import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

import { JwtMiddleware } from './jwt.middleware';

describe('JwtMiddleware', () => {
  let jwt: jest.Mocked<JwtService>;
  let middleware: JwtMiddleware;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    jwt = { verifyAsync: jest.fn() } as unknown as jest.Mocked<JwtService>;
    middleware = new JwtMiddleware(jwt);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('throws when token missing', async () => {
    const req = { headers: {} } as unknown as Request;
    await expect(middleware.use(req, {} as unknown as Response, jest.fn())).rejects.toThrow(UnauthorizedException);
  });

  it('throws when token invalid', async () => {
    jwt.verifyAsync.mockRejectedValue(new Error('bad'));
    const req = { headers: { authorization: 'Bearer bad' } } as unknown as Request;
    await expect(middleware.use(req, {} as unknown as Response, jest.fn())).rejects.toThrow(UnauthorizedException);
  });

  it('attaches user and calls next on success', async () => {
    jwt.verifyAsync.mockResolvedValue({ sub: 1 });
    const req = { headers: { authorization: 'Bearer good' } } as unknown as Request & { user?: unknown };
    const next = jest.fn();
    await middleware.use(req, {} as unknown as Response, next);
    expect(jwt.verifyAsync).toHaveBeenCalledWith('good', { secret: 'secret' });
    expect(req.user).toEqual({ sub: 1 });
    expect(next).toHaveBeenCalled();
  });
});
