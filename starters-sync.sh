#!/bin/bash

# metro hates symlinks doing this for local dev :/
# use this to watch/copy all of tamagui over to starters for testing

FROM="$HOME/tamagui"
TO="$HOME/starters/next-expo-solito/node_modules"

function sync() {
  echo "syncing...."
  # copy in *all* node modules to ensure sub-deps shared (but prefer not to overwrite)
  rsync --exclude-from="$FROM/starters-sync-exclude.txt" --ignore-existing -al "$FROM/node_modules/" "$TO"

  # special case (non @tamagui/*)
  rsync -a --delete "$FROM/packages/tamagui/" "$TO/tamagui" &
  rsync -a --delete "$FROM/packages/loader/" "$TO/tamagui-loader" &
  
  # all @tamagui/*
  rsync -a \
    --exclude="$FROM/packages/loader/" \
    --exclude="$FROM/packages/tamagui/" \
     "$FROM/packages/" "$TO/@tamagui" &
  wait

  rm -r "$TO/@floating-ui/react-dom-interactions/node_modules" || true

  pushd "$TO" || exit
  # rm -r node || true
  watchman watch-del-all 2&> /dev/null
  rm -r "$TMPDIR/metro-cache" 2&> /dev/null || true
  popd || exit

  rm -r "$TO/../apps/next/node_modules/.cache" || true
  rm -r "$TO/../apps/next/.next" || true

  echo "done"
}

sync
fswatch -o ~/tamagui/packages | while read f; do sync; done
