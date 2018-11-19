#!/bin/sh
BUILD_ID=dontKillMe bash -c "daemon --name="pm2" --command 'pm2 start ./src/server/index.js'"
