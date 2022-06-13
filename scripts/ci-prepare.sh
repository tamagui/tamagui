#!/bin/bash

rm -r takeout
mkdir takeout

pushd packages/site || exit

  rm -r pages/studio pages/takeout
  rm pages/account.tsx pages/signup.tsx pages/signin.tsx
  
popd || exit
