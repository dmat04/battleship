FROM node:20 AS base

WORKDIR /usr/src/app
COPY . .

FROM base AS test
RUN npm ci --include=dev
RUN --mount=type=secret,id=dotenvx-key,required=true,target=client/.env.keys \
  npm run test --workspace=client

FROM base AS prod
RUN npm ci
RUN --mount=type=secret,id=dotenvx-key,required=true,target=client/.env.keys \
  npm run build --workspace=client

FROM nginx:1.25-alpine
COPY --from=prod  /usr/src/app/client/build /usr/share/nginx/html