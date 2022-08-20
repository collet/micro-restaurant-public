#!/bin/bash

echo "starting dining-service"
docker-compose --env-file ./.env.docker \
               --file docker-compose-dining-alone.yml up
