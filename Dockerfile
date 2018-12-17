FROM node:8.10.0-slim

WORKDIR /usr/node/jogging-app
RUN apt-get update && apt-get install -y bash git openssl curl sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    echo '%node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    chown -R node:node . /usr/node/jogging-app
USER node

COPY --chown=node:node package.json .
COPY --chown=node:node package-lock.json .
RUN npm install --production

COPY --chown=node:node ./ ./
RUN npm run build

ENV DOCKER_BUILD=true
ENV NODE_ENV=production
