#!/bin/bash

npx turbo-ignore @tamagui/studio --fallback=HEAD^

exit_status=$?

if [[ "$exit_status" == 1 ]] ; then
  echo "✅ - Proceed"
  exit 1;
else
  echo "🛑 - Cancelled"
  exit 0;
fi
