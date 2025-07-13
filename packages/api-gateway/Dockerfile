# Multi-stage build for api-gateway
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json nx.json tsconfig.base.json tsconfig.json babel.config.json ./
RUN npm ci --legacy-peer-deps

FROM deps AS build
COPY libs ./libs
COPY packages/api-gateway ./packages/api-gateway
RUN npx nx build api-gateway --prod

FROM node:18-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=build /app/dist/packages/api-gateway ./
ENV NODE_ENV=production
CMD ["node", "main.js"]
