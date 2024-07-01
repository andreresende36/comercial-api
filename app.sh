#!/bin/sh
npm install
docker compose up -d
node ace migration:rollback --batch=0
node ace migration:run
node ace db:seed
node ace serve --watch
