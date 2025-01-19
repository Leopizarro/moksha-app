FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install --force @img/sharp-linuxmusl-arm64

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]