FROM node:16.3

WORKDIR /app

ADD . /app

COPY package*.json ./

RUN npm install

COPY . .

CMD node index.js

