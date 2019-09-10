FROM node:12.2.0

WORKDIR /app
COPY . /app

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install
RUN npm install -g @angular/cli

CMD ng build --prod="true"

CMD ng serve --host 0.0.0.0