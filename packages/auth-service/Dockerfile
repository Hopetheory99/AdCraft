# Multi-stage build for auth-service
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json nx.json tsconfig.base.json tsconfig.json babel.config.json ./
RUN npm ci --legacy-peer-deps

FROM deps AS build
COPY libs ./libs
COPY packages/auth-service ./packages/auth-service
RUN npx nx build auth-service --prod

FROM node:18-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=build /app/dist/packages/auth-service ./
ENV NODE_ENV=production
CMD ["node", "main.js"]
