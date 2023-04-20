#!/bin/bash

docker build . -t my-git-crypt-image
docker run --name my-git-crypt-container my-git-crypt-image .
sleep 5
docker cp my-git-crypt-container:/usr/local/bin/git-crypt ./git-crypt
