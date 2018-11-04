# Jogging App

## Requirements

NodeJS version should be at least 8.12.0.
npm version should be at least 6.4.1.
Docker version at least 18.06.1-ce.

## Installation

-   run `npm install`
-   in the root project folder create `.env` file and specify all envonment variables which listed in `.env.example` file
-   run `npm run db:create:dev` (or `npm run db:create:prod` for production) and `npm run db:migrate` to create and initialize your own postgresql database

## Running

-   run `npm run dev` for development purposes or `npm run build && npm start` for production

Also you can use docker for running (production only):

-   `docker build -t joggingapp .` to build docker image locally
-   `docker run -d -p 3000:3000 --env-file .env joggingapp` to run the app
-   `docker stop $(docker ps -q --filter ancestor=joggingapp )` to gracefully shutdown the running app
