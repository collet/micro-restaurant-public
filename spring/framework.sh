## common functions

set -e

function wait_on_health()  # $1 is URL of the Spring service with actuator on, $2 is the service name
{
   until [ $(curl --silent "$1"/actuator/health | grep UP -c ) == 1 ]
   do
      echo "$2 service not ready at $1"
      sleep 3
   done
   echo "$2 service is up and running at $1"
}

