#!/bin/bash

. ticktick.sh

function run_test() {
  printf "Starting the full docker-compose in background\n"
  ./start-all.sh
  sleep 2
  printf "## Putting chocolatetest in menu\n"
  item=`curl --silent --location --request POST 'http://localhost:9500/menu/menus/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "fullName": "Testing chocolate",
    "shortName": "chocolatetest",
    "price": 400.0,
    "category": "DESSERT",
    "image": "https://cdn.pixabay.com/photo/2020/07/31/11/53/ice-cream-5452794_960_720.jpg"
}'`
  tickParse "$item"
  itemId=``id``
  tickReset
  printf "testing item id is: $itemId \n"
  printf "## Opening table 1\n"
  order=`curl --silent --location --request POST 'http://localhost:9500/dining/tableOrders' \
--header 'Content-Type: application/json' \
--data-raw '{
    "tableId": "1",
    "customersCount": "3"
}'`
  tickParse "$order"
  orderId=``id``
  tickReset
  printf "order id is: $orderId \n"
  printf "## Firing 5 concurrent adds to the order\n"
  curl --write-out '%{http_code}' --silent --show-error --output /dev/null --location --request POST 'http://localhost:9500/dining/tableOrders/'$orderId \
--header 'Content-Type: application/json' \
--data-raw '{
    "shortName": "chocolatetest",
    "id": "'$itemId'",
    "howMany": "1"
}' & curl --write-out '%{http_code}' --silent --show-error --output /dev/null --location --request POST 'http://localhost:9500/dining/tableOrders/'$orderId \
--header 'Content-Type: application/json' \
--data-raw '{
  "shortName": "chocolatetest",
  "id": "'$itemId'",
  "howMany": "2"
}' & curl --write-out '%{http_code}' --silent --show-error --output /dev/null --location --request POST 'http://localhost:9500/dining/tableOrders/'$orderId \
--header 'Content-Type: application/json' \
--data-raw '{
  "shortName": "chocolatetest",
  "id": "'$itemId'",
  "howMany": "3"
}' & curl --write-out '%{http_code}' --silent --show-error --output /dev/null --location --request POST 'http://localhost:9500/dining/tableOrders/'$orderId \
--header 'Content-Type: application/json' \
--data-raw '{
  "shortName": "chocolatetest",
  "id": "'$itemId'",
  "howMany": "4"
}' & curl --write-out '%{http_code}' --silent --show-error --output /dev/null --location --request POST 'http://localhost:9500/dining/tableOrders/'$orderId \
--header 'Content-Type: application/json' \
--data-raw '{
  "shortName": "chocolatetest",
  "id": "'$itemId'",
  "howMany": "5"
}'
sleep 2
printf "\n## Checking tableOrder content\n"
order=`curl --silent --location --request GET 'http://localhost:9500/dining/tableOrders/'$orderId \
--header 'Content-Type: application/json'`
printf "Order content: $order \n"
tickParse "$order"
for line in ``lines.items()``; do
    printf "    - %s\n" "${!line}"
  done
lineNumber=``lines.length()``
echo $((lineNumber/4)) "lines in the order"
ret_code=$?
echo "Stopping the docker-compose gracefully"
./stop-all.sh
  return $ret_code
}


echo "Running concurrency test WITH NO PRIOR BUILD"
echo "through the gateway"
run_test
ret_code=$?
exit $ret_code
