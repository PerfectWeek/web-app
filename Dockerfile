FROM node:11

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./ ./

EXPOSE 5000

CMD npm run build-locale && npm run start:prod
