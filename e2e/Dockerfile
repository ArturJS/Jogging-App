FROM cypress/browsers:chrome69
RUN node --version
RUN npm --version
WORKDIR /home/node/app

COPY package.json .
COPY package-lock.json .

# avoid many lines of progress bars during install
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1

# install NPM dependencies and Cypress binary
RUN npm install --production

COPY cypress.json .
COPY cypress ./cypress
COPY wait-for-it.sh .

# check if the binary was installed successfully
RUN $(npm bin)/cypress verify
