#!/bin/bash

source ../framework.sh

docker-compose --file docker-compose-menu.yml up -d

wait_on_health http://localhost:3000 ${PWD##*/}

