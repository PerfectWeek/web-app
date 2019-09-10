FROM node:11

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./ ./

RUN npm run build:prod

EXPOSE 4200

CMD npm run start:prod
