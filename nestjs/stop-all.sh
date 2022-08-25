#!/bin/bash

echo "stopping all"
docker-compose --env-file ./.env.docker \
               --file menu-service/docker-compose-menu.yml \
               --file dining-service/docker-compose-dining.yml \
               --file kitchen-service/docker-compose-kitchen.yml down

echo "all services stopped"
