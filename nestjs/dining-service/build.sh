#!/bin/bash

APP="${PWD##*/}"

# Building docker image
echo "Begin: Building docker image nestjs-restaurant/$APP"
docker build -t "nestjs-restaurant/$APP" .
echo "Done: Building docker image nestjs-restaurant/$APP"
