#!/bin/bash
# build and run docker locally with bento from ../bento
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
PARENT_DIR="$(dirname "$REPO_ROOT")"
REPO_NAME="$(basename "$REPO_ROOT")"

ACTION="${1:-build}"

# check bento exists
if [ ! -d "$PARENT_DIR/bento" ]; then
  echo "❌ Error: bento not found at $PARENT_DIR/bento"
  exit 1
fi

# load env vars if .env exists (for both build and run)
load_env_file() {
  local file="$1"
  local prefix="$2"
  if [ -f "$file" ]; then
    echo "Loading env vars from $file..."
    while IFS='=' read -r key value || [ -n "$key" ]; do
      # skip comments and empty lines
      [[ $key =~ ^#.*$ ]] && continue
      [[ -z "$key" ]] && continue
      # trim whitespace
      key="${key%"${key##*[![:space:]]}"}"
      # remove quotes from value
      value="${value%\"}"
      value="${value#\"}"
      value="${value%\'}"
      value="${value#\'}"
      if [ "$prefix" = "build" ]; then
        BUILD_ARGS="$BUILD_ARGS --build-arg $key=$value"
      else
        RUN_ARGS="$RUN_ARGS -e $key=$value"
      fi
    done < "$file"
  fi
}

if [ "$ACTION" = "run" ]; then
  RUN_ARGS=""
  # load env for runtime
  load_env_file "$REPO_ROOT/.env" "run"
  load_env_file "$REPO_ROOT/.env.local" "run"

  echo "🚀 Running tamagui-site on http://localhost:3000"
  # use -it only if we have a tty
  if [ -t 0 ]; then
    docker run -it --rm -p 3000:3000 $RUN_ARGS tamagui-site
  else
    docker run --rm -p 3000:3000 $RUN_ARGS tamagui-site
  fi
  exit 0
fi

if [ "$ACTION" = "build-run" ]; then
  "$0" build && "$0" run
  exit 0
fi

# build
echo "📦 Building from $PARENT_DIR with bento..."

# create a .dockerignore in parent to speed up build
PARENT_DOCKERIGNORE="$PARENT_DIR/.dockerignore"
CREATED_DOCKERIGNORE=false

if [ ! -f "$PARENT_DOCKERIGNORE" ]; then
  cat > "$PARENT_DOCKERIGNORE" << 'EOF'
.DS_Store
**/node_modules
**/.yarn/install-state.gz
**/dist
**/.turbo
**/.tamagui
**/.expo
**/ios
**/android
**/.git
EOF
  CREATED_DOCKERIGNORE=true
  echo "Created temporary .dockerignore in parent"
fi

cleanup() {
  if [ "$CREATED_DOCKERIGNORE" = true ] && [ -f "$PARENT_DOCKERIGNORE" ]; then
    rm "$PARENT_DOCKERIGNORE"
    echo "Cleaned up temporary .dockerignore"
  fi
}
trap cleanup EXIT

BUILD_ARGS=""
load_env_file "$REPO_ROOT/.env" "build"
load_env_file "$REPO_ROOT/.env.local" "build"

# build from parent directory
cd "$PARENT_DIR"
docker build \
  --progress=plain \
  -f "$REPO_NAME/Dockerfile.local" \
  $BUILD_ARGS \
  -t tamagui-site \
  .

echo ""
echo "✅ Build complete!"
echo ""
echo "Run with: ./scripts/docker-local.sh run"
echo "Or:       docker run -it -p 3000:3000 --env-file .env tamagui-site"
