FROM node:12.2.0

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN npm install
RUN npm install -g @angular/cli

COPY . /app

CMD ng serve --host 0.0.0.0