#!/bin/bash

kill -9 $(lsof -ti:5005) &>/dev/null || true
