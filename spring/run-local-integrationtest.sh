#!/bin/bash

function run_test_with_profile() { # $1 the maven profile to run tests with
  echo "Starting the full docker-compose in background"
  ./start-all.sh
  echo "Running integration-tests with maven with direct access to backend microservices"
  cd integration-tests
  mvn clean test -P $1
  ret_code=$?
  echo "Stopping the docker-compose gracefully"
  cd ..
  ./stop-all.sh
  return $ret_code
}

echo "Running IT test WITH NO PRIOR BUILD"
echo "## Running IT with direct access to backend microservices"
run_test_with_profile direct
echo "## Running IT through the gateway"
run_test_with_profile gateway
ret_code=$?
exit $ret_code


