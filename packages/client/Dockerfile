FROM node:20 AS base

WORKDIR /usr/src/app
COPY --chown=node:node . .

FROM base AS test
RUN npm ci --include=dev
USER node
RUN --mount=type=secret,id=dotenvx-key,target=client/.env.keys \
  npm run test --workspace=@battleship/client

FROM base AS build
RUN npm ci
USER node
RUN --mount=type=secret,id=dotenvx-key,target=client/.env.keys \
  npm run build --workspace=@battleship/client

FROM nginx:1.25-alpine AS prod
COPY --from=build  /usr/src/app/packages/client/build /usr/share/nginx/html