#!/bin/bash

echo "starting menu-service"
docker-compose --env-file ./.env.docker \
               --file docker-compose-menu.yml up
