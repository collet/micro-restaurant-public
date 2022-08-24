#!/bin/bash

source ./framework.sh

echo "starting all"
docker-compose --file menu-service/docker-compose-menu.yml \
               --file dining-service/docker-compose-dining.yml \
               --file kitchen-service/docker-compose-kitchen.yml up -d

wait_on_health http://localhost:3000 menu
wait_on_health http://localhost:3002 kitchen
wait_on_health http://localhost:3001 dining
echo "all services started"