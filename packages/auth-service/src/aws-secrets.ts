import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

export async function loadAwsSecrets(): Promise<void> {
  const secretId = process.env.AWS_SECRET_ID;
  if (!secretId) {
    return;
  }

  const client = new SecretsManagerClient({
    region: process.env.AWS_REGION || 'us-east-1',
  });

  const response = await client.send(new GetSecretValueCommand({ SecretId: secretId }));

  if (response.SecretString) {
    try {
      const secrets = JSON.parse(response.SecretString);
      for (const [key, value] of Object.entries(secrets)) {
        process.env[key] = String(value);
      }
    } catch (err) {
      console.error('Failed to parse secret string from AWS Secrets Manager');
      throw err;
    }
  }
}
