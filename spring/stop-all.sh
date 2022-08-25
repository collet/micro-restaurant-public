#!/bin/bash

echo "stopping all"
docker-compose --file menu-service/docker-compose-menu.yml \
               --file dining-service/docker-compose-dining.yml \
               --file kitchen-service/docker-compose-kitchen.yml \
               --file gateway/docker-compose-gateway.yml down
echo "all services stopped behind gateway"