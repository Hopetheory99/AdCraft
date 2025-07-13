import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  const env = process.env.NODE_ENV;
  const sync = process.env.DB_SYNC;

  beforeEach(() => {
    process.env.NODE_ENV = 'production';
    process.env.DB_SYNC = 'true';
  });

  afterEach(() => {
    process.env.NODE_ENV = env;
    if (sync === undefined) {
      delete process.env.DB_SYNC;
    } else {
      process.env.DB_SYNC = sync;
    }
    jest.resetModules();
  });

  it('throws when DB_SYNC is enabled in production', async () => {
    await expect(
      Test.createTestingModule({
        imports: [AppModule],
      }).compile(),
    ).rejects.toThrow('DB_SYNC cannot be enabled in production');
  });
});
