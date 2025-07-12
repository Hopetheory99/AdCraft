import { loadAwsSecrets } from './aws-secrets';

jest.mock('@aws-sdk/client-secrets-manager', () => {
  return {
    SecretsManagerClient: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({ SecretString: JSON.stringify({ TEST_VAR: 'abc' }) }),
    })),
    GetSecretValueCommand: jest.fn(),
  };
});

describe('loadAwsSecrets', () => {
  beforeEach(() => {
    process.env.AWS_SECRET_ID = 'test';
  });

  afterEach(() => {
    delete process.env.AWS_SECRET_ID;
    delete process.env.TEST_VAR;
    jest.resetAllMocks();
  });

  it('loads secrets and sets environment variables', async () => {
    await loadAwsSecrets();
    expect(process.env.TEST_VAR).toBe('abc');
  });
});
