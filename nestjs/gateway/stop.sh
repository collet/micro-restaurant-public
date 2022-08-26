#!/bin/bash

echo "stopping gateway"
docker-compose --env-file ./.env.docker \
               --file docker-compose-gateway-alone.yml down
