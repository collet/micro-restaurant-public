#!/bin/bash

echo "Running IT test WITH NO PRIOR BUILD"
echo "Starting the full docker-compose in background"
./start-all.sh &
echo "Waiting for 10 sec"
sleep 10
echo "Running integration-tests with maven"
cd integration-tests
mvn clean test
ret_code=$?
echo "Stopping the docker-compose gracefully"
cd ..
./stop-all.sh
exit $ret_code