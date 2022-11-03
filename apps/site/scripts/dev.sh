#!/bin/bash

PORT=${PORT:-5005} NODE_OPTIONS='--no-deprecation' NODE_ENV=development yarn watch:site-data
