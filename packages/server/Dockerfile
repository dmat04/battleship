FROM node:lts as base
WORKDIR /usr/src/app
COPY --chown=node:node . .

FROM base AS test
RUN npm ci --include=dev
RUN --mount=type=secret,id=server-env-key,target=packages/server/.env.keys,required=true \
  npm run test --workspace=@battleship/server

FROM base AS build
RUN npm ci
RUN --mount=type=secret,id=server-env-key,target=packages/server/.env.keys,required=true \
  npm run build --workspace=@battleship/server

FROM build as prod
USER node
CMD ["npm", "run", "start:prod", "--workspace=@battleship/server"]