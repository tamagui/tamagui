#!/usr/bin/env bash
#
# Script to remove GPG key from git-crypt
#
# It will re-initialize git-crypt for the repository and re-add all keys except
# the one requested for removal.
#
# Note: You still need to change all your secrets to fully protect yourself.
# Removing a user will prevent them from reading future changes but they will
# still have a copy of the data up to the point of their removal.
#
# Use:
#  ./git-crypt-remove.sh [FULL_GPG_FINGERPRINT [FULL_GPG_FINGERPRINT]]
#
# E.g.:
#  ./git-crypt-remove.sh 3BC18383F838C0B815B961480F8CAF5467D ABCD8383F838C0B815B961480F8CAF5467D
#
# The script will create multiple commits to your repo. Feel free to squash them
# all down to one.
#
# Based on https://github.com/AGWA/git-crypt/issues/47#issuecomment-212734882
# See https://gist.github.com/glogiotatidis/e0ab45ed5575a9d7973390dace0552b0 and
# https://gist.github.com/phunehehe/c083a3d27c1e1c8f316ad6790368b8b5
# https://gist.github.com/elektro-wolle/ed8da166474af46aad3bd7189665077f
#
#
set -e

if [ -z "$1" ]
then
    echo " Use:"
    echo "  ./git-crypt-remove.sh [FULL_GPG_FINGERPRINT]"
    echo ""
    echo " E.g.:"
    echo "  ./git-crypt-remove.sh 3BC18383F838C0B815B961480F8CAF5467D"
    exit;
fi

TMPDIR=`mktemp -d`
CURRENT_DIR=`git rev-parse --show-toplevel`
BASENAME=$(basename `pwd`)

# MacOS: use gnu-cp from homebrew
CP=gcp

# Unlock the directory, we need to copy encrypted versions of the files
git crypt unlock

# Work on copy.
$CP -rp `pwd` $TMPDIR


pushd $TMPDIR/$BASENAME

# Remove encrypted files and git-crypt
git crypt status | grep -v "not encrypted" | cut -d: -f 2- | cut -d\  -f 2- > "${TMPDIR}/encrypted-files"
cat "${TMPDIR}/encrypted-files" | tr '\n' '\000' | xargs -0 rm
git commit -a -m "Remove encrypted files"
rm -rf .git-crypt
git commit -a -m "Remove git-crypt"
rm -rf .git/git-crypt

# Re-initialize git crypt
git crypt init

# Add existing users, except the
for keyfilename in $CURRENT_DIR/.git-crypt/keys/default/0/*gpg; do
    basename=`basename $keyfilename`
    key=${basename%.*}
    set -x
    if [[ $@ == *$key* ]]; then
        continue;
    fi
    set +x
    git crypt add-gpg-user --trusted $key || echo "failed re-adding $key"
done

cd $CURRENT_DIR
cat "${TMPDIR}/encrypted-files" | while read i; do
    $CP -rp --parents "$i" $TMPDIR/$BASENAME;
done
cd $TMPDIR/$BASENAME
cat "${TMPDIR}/encrypted-files" | tr '\n' '\000' | xargs -0 git add
git commit -a -m "New encrypted files"
popd

git crypt lock
git pull $TMPDIR/$BASENAME

rm -rf $TMPDIR
