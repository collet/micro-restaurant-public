#!/bin/bash

source ../framework.sh

docker-compose --file docker-compose-dining-alone.yml up -d

wait_on_health http://localhost:3001 ${PWD##*/}


