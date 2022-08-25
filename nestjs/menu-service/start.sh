#!/bin/bash

source ../framework.sh

echo "starting menu-service"
docker-compose --env-file ./.env.docker \
               --file docker-compose-menu.yml up -d

wait_on_health http://localhost:3000 ${PWD##*/}
