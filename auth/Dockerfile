FROM node:15.8.0-alpine3.10

ENV CI=true

WORKDIR /app

COPY package.json ./

#RUN yarn install --production=true
RUN npm install --only=prod

COPY ./ ./

CMD [ "npm", "start" ]