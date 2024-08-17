FROM node:lts

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["npm", "run", "start:dev", "--workspace=@battleship/server"]