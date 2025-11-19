#!/usr/bin/env bash

# Cleanup script for removing transcrypt configuration
# Run this if you notice slow git commits after transcrypt was removed from the repo

set -e

echo "🧹 Cleaning up transcrypt configuration..."
echo ""

# Remove transcrypt git configs
echo "Removing transcrypt git configs..."
git config --unset-all filter.crypt.clean 2>/dev/null || true
git config --unset-all filter.crypt.smudge 2>/dev/null || true
git config --unset-all filter.crypt.required 2>/dev/null || true
git config --unset-all diff.crypt.textconv 2>/dev/null || true
git config --unset-all diff.crypt.cachetextconv 2>/dev/null || true
git config --unset-all diff.crypt.binary 2>/dev/null || true
git config --unset-all merge.crypt.driver 2>/dev/null || true
git config --unset-all merge.crypt.name 2>/dev/null || true
git config --unset-all transcrypt.version 2>/dev/null || true
git config --unset-all transcrypt.cipher 2>/dev/null || true
git config --unset-all transcrypt.password 2>/dev/null || true
git config --unset-all transcrypt.openssl-path 2>/dev/null || true

# Remove transcrypt aliases (if any)
git config --remove-section alias 2>/dev/null || true

echo "✓ Git configs cleaned"
echo ""

# Disable transcrypt hooks
if [ -f ".git/hooks/pre-commit" ]; then
    if grep -q "transcrypt" ".git/hooks/pre-commit" 2>/dev/null; then
        echo "Disabling transcrypt pre-commit hook..."
        mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled
        echo "✓ Pre-commit hook disabled"
    fi
fi

if [ -f ".git/hooks/pre-commit-crypt" ]; then
    echo "Disabling pre-commit-crypt hook..."
    mv .git/hooks/pre-commit-crypt .git/hooks/pre-commit-crypt.disabled 2>/dev/null || true
    echo "✓ Pre-commit-crypt hook disabled"
fi

echo ""
echo "✅ Transcrypt cleanup complete!"
echo ""
echo "Your git commits should now be much faster."
echo "You can verify by running: time git commit --dry-run -a -m 'test'"
