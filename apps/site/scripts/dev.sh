#!/bin/bash

kill -9 $(lsof -ti:5005)

PORT=${PORT:-5005} NODE_OPTIONS='--no-deprecation' NODE_ENV=development yarn watch:site-data
