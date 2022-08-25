#!/bin/bash

echo "Running IT test WITH NO PRIOR BUILD"
echo "Starting the full docker-compose in background"
./start-all.sh
echo "Running integration-tests"
cd integration-tests
npm run test:integration
ret_code=$?
echo "Stopping the docker-compose gracefully"
cd ..
./stop-all.sh
exit $ret_code
