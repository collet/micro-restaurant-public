#!/bin/bash

source ../framework.sh

docker-compose --file docker-compose-kitchen.yml up -d

wait_on_health http://localhost:3002 ${PWD##*/}
