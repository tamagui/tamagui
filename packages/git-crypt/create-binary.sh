#!/bin/bash

docker build . -t git-crypt-image
docker run --name git-crypt-container git-crypt-image .
sleep 5
docker cp git-crypt-container:/usr/local/bin/git-crypt ./git-crypt-bin
