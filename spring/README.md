# micro-restaurant Spring implementation

* Author: Philippe Collet

## Principles

* Bounded contexts used for the different context of usage within the restaurant
* Isolated micro-services with own DB
* Simple gateway (with services behind the gateway still visible for testing and debugging purposes)

**Not applied:**

* Event sourcing with event bus
* Full DDD (Spring only supports part of the hexagonal architecture, i.e., repositories and controllers)

## Features

* Menu management (with type of entry + image associated)
* Table management (table numbering)
* Table order management (start/end order on a table, add items, send them to kitchen, bill)
* Kitchen management (receiving batches of menu items to be cooked, making them available and tracing when they are taken back to table)

**Not yet implemented:**

* Proper logging
* External Bank system
* Gateway

## List of micro-services

* `menu-service` (deployed on `http://localhost:3000/menus` with API doc at `/doc/menus`): implements the content of the menu, which could be used to display it, checks consistency with other services using the menu items.
* `dining-service` (deployed on `http://localhost:3001/tables and /tableOrders` with API doc at `doc/dining`): implements the dining room context, with table management, and ordering at the table level. 
This service is coupled to menu to get the menu entries, and to kitchen to send the orders to be prepared one the ordering is done.
* `kitchen-service` (deployed on `http://localhost:3002/preparation and preparedItems with API doc at `doc/kitchen`): implements the kitchen context, receiving btaches of items to be cooked and served back.
* `integration-tests`: a specific service that run end-to-end tests at the API level through Rest-Assured after docker-composing the other services (maven execution for running tests over localhost deployments).
* `gateway` sets up the gateway to `http://localhost:9500` with subroutes to the different micro-services

##  Common implementation stack

The tech stack is based on:
* Java 17
* SpringBoot 2.7.1
* MongoDB 4.4.15
* Docker Engine 20.10+
* Docker Compose 2.6+
* TestContainers, RestAssured, Springdoc (see `pom.xml`)

Each service is dockerized with its DB. The following scripts are provided:
* `build.sh` compiles and containerizes the service
* `start.sh` runs it through docker compose (composing only the service and its DB)
* `stop.sh` puts down the docker composition
*but the start/stop scripts were developed for the MVP. the "all" version below should be used.*

The overall build and run of all services (+ the integration testing service) are managed through the following scripts:
* `build-all.sh` runs the build in each service (except testing services)
* `run-local-integrationtest.sh` compiles and runs the integration tests (without prior building of the services), starting and stopping all the services
* `start-all.sh` runs all the service with a single docker-compose (**and enables to see the swagger doc**)
* `follow-logs.sh` enables to follow all logs for all services when they are started with compose in the background
* `stop-all.sh` puts down the previous composition



