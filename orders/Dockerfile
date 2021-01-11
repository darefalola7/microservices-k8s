FROM node:15.5.1-alpine3.10

ENV CI=true

WORKDIR /app

COPY package.json ./

#RUN yarn --registry http://registry.npmjs.org

RUN yarn install --production=true

COPY ./ ./

#RUN npm config set proxy null
#RUN npm config set https-proxy null
#RUN npm config set registry http://registry.npmjs.org/
#RUN npm install --only=production


CMD [ "yarn", "start" ]