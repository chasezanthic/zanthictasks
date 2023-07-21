#!/bin/bash

# config
export ROOT_DIR=$(dirname "$(realpath "$0")")
export BACKEND_URL=https://server-production-b78d.up.railway.app
export BUILD=$ROOT_DIR/.wasp/build
export LINK="railway link --environment production zanthic-tasks"
export PROJECT_ID=f35986e8-e44a-49ed-8572-23397df807be

force_rebuild=0
server_only=0
client_only=0

while getopts ":rsc" option; do
  case $option in
    r) force_rebuild=1 ;;
    s) server_only=1 ;;
    c) client_only=1 ;;
    \?) echo "Invalid option: -$OPTARG" >&2; exit 1 ;;
  esac
done

if [ $force_rebuild -eq 1 ]
then
    echo "*********** Rebuilding App ***********"
    wasp build
fi

if [ $client_only -eq 0 ]
then
    echo "*********** Deploying Server ***********"
    cp $ROOT_DIR/newdock $BUILD/Dockerfile
    cd $BUILD && railway link --environment production $PROJECT_ID
    cd ./server && railway up -s server -d
    echo "*********** Successfully Deployed Server ***********"
fi

if [ $server_only -eq 1 ]
then
    exit
fi

echo "*********** Deploying Client ***********"
clientdir=$BUILD/web-app
cp $ROOT_DIR/railway_conf/* $clientdir
cd $clientdir && npm install && REACT_APP_API_URL=$BACKEND_URL npm run build
cd $clientdir/build && railway link --environment production $PROJECT_ID && railway up -s client -d
echo "*********** Successfully Deployed Client ***********"

