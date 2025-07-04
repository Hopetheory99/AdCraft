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

## State Management
Redux slices are located in `src/app/slices/`. The store is configured in `src/app/store.ts`.

## Contributing
- Follow the code style enforced by Prettier and ESLint.
- See `CONTRIBUTING.md` for more details.

## Documentation
- See the `docs/` folder for architecture, implementation, and usage guides.

## License
MIT
