# Jogging App

## Requirements

NodeJS version should be at least 8.12.0.
npm version should be at least 6.4.1.

## Installation

- run `npm install`
- in the root project folder create `.env` file and specify all envonment variables which listed in `.env.example` file
- run `npm run db:create:dev` (or `npm run db:create:prod` for production) and `npm run db:migrate` to create and initialize your own postgresql database
- run `npm run dev` for development purposes or `npm run build && npm start` for production
