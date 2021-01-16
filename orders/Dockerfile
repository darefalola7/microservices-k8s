FROM node:15.5.1-alpine3.10

ENV CI=true

WORKDIR /app

COPY package.json ./

#RUN yarn --registry http://registry.npmjs.org

RUN yarn install --production=true

COPY ./ ./

CMD [ "yarn", "start" ]