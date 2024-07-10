FROM node:alpine AS base

WORKDIR /app
COPY . .
RUN corepack enable

FROM base AS build

RUN pnpm install
RUN pnpm exec nx build @ticketmaster/catalog

RUN pnpm --filter @ticketmaster/catalog deploy -P pruned

FROM node:alpine

RUN corepack enable

WORKDIR /app

COPY --from=build /app/pruned/node_modules /app/node_modules
COPY --from=build /app/pruned/dist /app/dist
COPY --from=build /app/pruned/package.json /app/package.json

CMD ["pnpm", "start:prod"]