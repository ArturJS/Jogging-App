FROM node:8-slim as frontend
RUN apt-get update && apt-get install -y bash git openssl curl sudo
WORKDIR /frontend
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    echo '%node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    chown -R node:node . /frontend
USER node
COPY --chown=node:node ./frontend/package.json .
COPY --chown=node:node ./frontend/package-lock.json .
RUN npm install --production
COPY --chown=node:node ./frontend/ ./
RUN npm run build

FROM node:8-slim
RUN apt-get update && apt-get install -y bash git openssl curl sudo
WORKDIR /backend
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    echo '%node ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \ 
    chown -R node:node . /backend
USER node
COPY --chown=node:node ./backend/package.json .
COPY --chown=node:node ./backend/package-lock.json .
RUN npm install --production
COPY --chown=node:node ./backend/ ./
COPY --from=frontend --chown=node:node /frontend /frontend
ENV DOCKER_BUILD=true
ENV NODE_ENV=production
