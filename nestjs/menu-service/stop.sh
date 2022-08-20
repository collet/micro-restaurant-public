#!/bin/bash

echo "stopping menu-service"
docker-compose --env-file ./.env.docker \
               --file docker-compose-menu.yml down
