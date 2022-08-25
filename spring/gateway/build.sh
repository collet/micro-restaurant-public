#!/bin/bash

APP="${PWD##*/}"

# Compiling and buildpacking docker image
echo "Compiling $APP"
mvn clean spring-boot:build-image -Dspring-boot.build-image.imageName="restaurant/$APP"
echo "Done"
