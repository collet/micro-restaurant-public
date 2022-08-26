#!/bin/bash

function compile_dir()  # $1 is the dir to get it
{
    cd $1
    ./build.sh
    cd ..
}

echo "** Compiling all"

compile_dir "menu-service"

compile_dir "dining-service"

compile_dir "kitchen-service"

compile_dir "gateway"

echo "** Done all"

