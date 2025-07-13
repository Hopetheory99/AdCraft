# Development Environment Setup

This guide explains how to configure a local AdCraft development environment.

## Prerequisites
- Node.js 18 or later
- Docker and Docker Compose
- Nx CLI (`npm install -g nx`)

## Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourorganization/adcraft.git
   cd adcraft
   ```
2. **Copy the environment file**
   ```bash
   cp .env.example .env
   ```
   Adjust values for your local database credentials and JWT secrets.
3. **Install dependencies**
   ```bash
   npm install
   ```
   If you encounter dependency resolution errors, use the legacy flag:
   ```bash
   npm install --legacy-peer-deps
   ```
4. **Start services with Docker Compose**
   ```bash
   docker-compose up
   ```
5. **Running individual apps**
   ```bash
   nx serve auth-service
   nx serve api-gateway
   nx serve frontend-frontend
   ```
6. **Nx Cloud (optional)**
   Obtain an access token and set `NX_CLOUD_ACCESS_TOKEN` in your `.env` file.

Environment variables such as `JWT_SECRET`, `JWT_REFRESH_SECRET`, and database credentials are loaded from `.env`.  For development you may keep values in this file, but in production the services retrieve secrets from **AWS Secrets Manager**.  Set `AWS_REGION` and `AWS_SECRET_ID` in your environment and Docker Compose will pass them to the containers.  On startup the auth service uses these values to load secrets and populate its configuration automatically.
