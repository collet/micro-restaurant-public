#!/bin/bash

source ../framework.sh

echo "starting dining-service"
docker-compose --env-file ./.env.docker \
               --file docker-compose-dining-alone.yml up -d

wait_on_health http://localhost:3001 ${PWD##*/}
