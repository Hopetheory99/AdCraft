# AdCraft

## Overview
AdCraft is a modern ad creation platform built with React, Redux Toolkit, TypeScript, Material-UI, and Nx monorepo architecture. It features:
- Modular frontend (React) and backend (NestJS microservices, with PostgreSQL for authentication)
- State management with Redux Toolkit
- Asset, template, and project management
- Ad editor with Fabric.js

## Project Structure
```
AdCraft/
├── packages/
│   ├── frontend/
│   │   └── frontend/
│   │       └── src/
│   │           └── app/
│   │               ├── slices/
│   │               │   ├── authSlice.ts
│   │               │   ├── adsSlice.ts
│   │               │   ├── templatesSlice.ts
│   │               │   ├── assetsSlice.ts
│   │               │   └── projectsSlice.ts
│   │               └── store.ts
│   └── auth-service/
│       └── ...
├── docs/
├── logbook/
├── ...
```

## Getting Started
1. **Database Setup (for `auth-service`):**
   Create a `.env` file in `packages/auth-service/` with the following content:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=user
   DB_PASSWORD=password
   DB_DATABASE=adcraft_auth
   JWT_SECRET=your_super_secret_jwt_key
   JWT_REFRESH_TOKEN_EXPIRATION_DAYS=7
   ```
   **Note:** Replace `your_super_secret_jwt_key` with a strong, unique secret.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run database migrations (for `auth-service`):
   Ensure your PostgreSQL database is running (e.g., via `docker-compose up -d postgres`). Then run:
   ```bash
   npm run typeorm:run-migrations
   ```

4. Run the frontend:
   ```bash
   nx serve frontend
   ```

5. Run the backend:
   ```bash
   nx serve auth-service
   ```

## State Management
Redux slices are located in `src/app/slices/`. The store is configured in `src/app/store.ts`.

## Contributing
- Follow the code style enforced by Prettier and ESLint.
- See `CONTRIBUTING.md` for more details.

## Documentation
- See the `docs/` folder for architecture, implementation, and usage guides.

## License
MIT
