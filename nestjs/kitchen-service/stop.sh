#!/bin/bash

echo "stopping kitchen-service"
docker-compose --env-file ./.env.docker \
               --file docker-compose-kitchen.yml down
