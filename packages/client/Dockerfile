FROM node:20 AS base

WORKDIR /usr/src/app
COPY --chown=node:node . .

FROM base AS test
RUN npm ci --include=dev
RUN --mount=type=secret,id=client-env-key,target=packages/client/.env.keys,required=true \
  npm run test --workspace=@battleship/client

FROM base AS build
RUN npm ci
RUN --mount=type=secret,id=client-env-key,target=packages/client/.env.keys,required=true \
  npm run build --workspace=@battleship/client

FROM nginx:1.25-alpine AS prod
COPY --from=build  /usr/src/app/packages/client/build /usr/share/nginx/html