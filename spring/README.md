# micro-restaurant Spring implementation

## Principles

* Bounded contexts used for the different context of usage within the restaurant
* Isolated micro-services with own DB

Not applied:

* Event sourcing with event bus

## List of micro-services

* `menu-service` 
* ...

##  Common implementation stack

* Each service is dockerized with its DB
* `build.sh` compiles and containerizes the service
* `start.sh` runs it through docker compose
* `stop.sh` puts down the docker composition



