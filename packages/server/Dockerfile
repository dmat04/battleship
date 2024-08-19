FROM node:lts as base
WORKDIR /usr/src/app
COPY --chown=node:node . .

FROM base AS test
RUN npm ci --include=dev
USER node
RUN --mount=type=secret,id=dotenvx-key,target=server/.env.keys \
  npm run test --workspace=@battleship/server

FROM base AS build
RUN npm ci
USER node
RUN --mount=type=secret,id=dotenvx-key,target=server/.env.keys \
  npm run build --workspace=@battleship/server

FROM build as prod
CMD ["npm", "run", "start:prod", "--workspace=@battleship/server"]