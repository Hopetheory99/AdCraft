# Contributing to AdCraft

Thank you for considering contributing to the AdCraft platform. This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to uphold our Code of Conduct, which requires treating all individuals with respect and creating a positive environment for everyone.

## Development Setup

### Prerequisites

- Node.js (v16.x or later)
- npm (v8.x or later)
- Docker and Docker Compose
- Git

### Getting Started

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/your-username/adcraft.git
   cd adcraft
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up development environment:

   ```bash
   # Start the development environment using Docker
   docker-compose up -d
   ```

4. Start the development server:

   ```bash
   # For frontend development
   npx nx serve frontend

   # For a specific backend service
   npx nx serve auth-service
   ```

## Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- Feature branches: Create from `develop` using the format `feature/[issue-id]-[short-description]`
- Hotfix branches: Create from `main` using the format `hotfix/[issue-id]-[short-description]`

## Development Workflow

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout develop
   git pull
   git checkout -b feature/[issue-id]-[short-description]
   ```

2. Make your changes, following the [Coding Standards](#coding-standards)

3. Run tests and linting:

   ```bash
   # Run linting
   npm run lint

   # Run tests for a specific project
   npx nx test [project-name]

   # Run all tests
   npx nx run-many --target=test --all
   ```

4. Commit your changes following the [Commit Message Guidelines](#commit-message-guidelines)

5. Push your branch and create a pull request against the `develop` branch

## Coding Standards

Please adhere to the following standards when contributing code:

### TypeScript/JavaScript

- Use TypeScript for all code with strict type checking
- Follow ESLint rules defined in the project
- Use Prettier for formatting (configured in the project)
- Use camelCase for variables, functions, methods
- Use PascalCase for classes, interfaces, types, enums
- Use UPPER_CASE for constants

### React

- Use functional components with hooks
- Define prop types with TypeScript interfaces
- Use CSS-in-JS with styled-components or Material-UI's styling system
- Follow the container/presentational pattern where appropriate
- Use React context and hooks for state management

### NestJS

- Follow the module pattern for organizing code
- Use dependency injection for all services
- Implement proper validation with class-validator
- Use appropriate decorators for controllers, services, etc.
- Follow RESTful API design principles

## Commit Message Guidelines

We follow the Conventional Commits specification for commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat(auth): implement JWT token refresh

- Add refresh token endpoint
- Implement token validation
- Update authentication service

Closes #123
```

```
fix(editor): resolve canvas resize issue

The canvas was not properly resizing when the window size changed.

Fixes #456
```

## Pull Request Process

1. Ensure your code passes all tests and linting
2. Update documentation if necessary
3. Include relevant tests for your changes
4. Link the PR to any relevant issues
5. Request a review from at least one maintainer
6. Once approved, the PR will be merged by a maintainer

## Resources

- [Project Execution Plan](./AdCraft-Project-Execution-Plan.md)
- [Documentation Index](./AdCraft-Documentation-Index.md)
- [Implementation Guide](./AdCraft%20-%20Implementation%20Guide.md)

Thank you for contributing to AdCraft!
