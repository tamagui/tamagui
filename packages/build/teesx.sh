#!/usr/bin/env bash

node --loader esbuild-register/loader -r esbuild-register "$@"
