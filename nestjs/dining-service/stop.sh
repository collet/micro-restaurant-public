#!/bin/bash

echo "stopping dining-service"
docker-compose --env-file ./.env.docker \
               --file docker-compose-dining-alone.yml down
