#!/bin/bash

echo "starting all"
docker-compose --file menu-service/docker-compose-menu.yml --file dining-service/docker-compose-dining.yml up
