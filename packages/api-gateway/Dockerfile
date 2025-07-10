# Multi-stage build for api-gateway
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx nx build api-gateway --prod

FROM node:18-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=build /app/dist/packages/api-gateway ./
ENV NODE_ENV=production
CMD ["node", "main.js"]
