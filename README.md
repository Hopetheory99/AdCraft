# AdCraft

## Overview
AdCraft is a modern ad creation platform built with React, Redux Toolkit, TypeScript, Material-UI, and Nx monorepo architecture. It features:
- Modular frontend (React) and backend (NestJS microservices, with PostgreSQL for authentication)
- State management with Redux Toolkit
- Responsive UI built with Material UI
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
### Environment Setup
Copy `.env.example` to `.env` and update the values for your local environment. These variables provide database credentials, JWT secrets, and port settings for the services defined in `docker-compose.yml`.

```bash
cp .env.example .env
```

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the frontend:
   ```bash
   nx serve frontend
   ```
3. Run the backend:
   ```bash
   nx serve auth-service
   ```
4. Or start all services with Docker Compose:
   ```bash
   docker-compose up
   ```

## CI/CD Configuration
Nx Cloud requires an access token for remote caching. Store this value as the `NX_CLOUD_ACCESS_TOKEN` environment variable and expose it during your build steps.

### GitHub Actions example
```yaml
- name: Build
  run: npx nx affected --target=build
  env:
    NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}
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

## Maintainers
The project is currently overseen by Codex (Head Admin) and Hopetheory99 (Project Owner). See `MAINTAINERS.md` for details.
