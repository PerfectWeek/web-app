FROM node:11

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./ ./

RUN npm run build-locale

EXPOSE 5000

CMD  npm run start:prod
