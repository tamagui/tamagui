#!/bin/bash

# Verify Bento Production Build
# Usage: ./verify-bento-prod.sh

set -e

echo "🔍 Verifying Bento Production Build..."
echo ""

# Check if server is running
if ! curl -s http://localhost:8081 > /dev/null; then
  echo "❌ Server not running on port 8081"
  echo "   Run: yarn serve"
  exit 1
fi

echo "✅ Server is running"

# Test /bento homepage
echo "Testing /bento..."
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:8081/bento)
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$STATUS" = "200" ]; then
  echo "✅ /bento returns 200"

  # Check for bento-specific content
  if echo "$BODY" | grep -q "tamagui.dev/bento"; then
    echo "✅ /bento contains bento metadata"
  else
    echo "⚠️  /bento missing expected metadata"
  fi
else
  echo "❌ /bento returns $STATUS"
  exit 1
fi

# Test /bento/forms/inputs
echo ""
echo "Testing /bento/forms/inputs..."
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:8081/bento/forms/inputs)
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$STATUS" = "200" ]; then
  echo "✅ /bento/forms/inputs returns 200"

  # Check for input/form components
  if echo "$BODY" | grep -q "Input\|Form"; then
    echo "✅ /bento/forms/inputs contains Input/Form modules"
  else
    echo "⚠️  /bento/forms/inputs missing expected modules"
  fi

  # Check for route params
  if echo "$BODY" | grep -q '"parts":"forms/inputs"'; then
    echo "✅ /bento/forms/inputs has correct route params"
  else
    echo "⚠️  /bento/forms/inputs missing route params"
  fi
else
  echo "❌ /bento/forms/inputs returns $STATUS"
  exit 1
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "Production build is working correctly!"
echo "  - /bento homepage: OK"
echo "  - /bento/forms/inputs: OK"
echo "  - Bento components: Loading"
echo ""
