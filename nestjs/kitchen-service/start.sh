#!/bin/bash

echo "starting kitchen-service"
docker-compose --env-file ./.env.docker \
               --file docker-compose-kitchen.yml up
