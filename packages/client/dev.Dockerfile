FROM node:22-alpine

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install

USER node

CMD ["npm", "run", "start:dev", "--workspace=@battleship/client"]