FROM node:22-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["npm", "run", "start:dev", "--workspace=@battleship/client"]