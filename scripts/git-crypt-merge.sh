ancestor_decrypted="$1__decrypt"
current_decrypted="$2__decrypt"
other_decrypted="$3__decrypt"
echo ""
echo "###########################"
echo "# Git crypt driver called #"
echo "###########################"
echo ""

echo "Decrypting ancestor file..."
cat $1 | git-crypt smudge > "${ancestor_decrypted}"
echo "Decrypting current file..."
cat $2 | git-crypt smudge > "${current_decrypted}"
echo "Decrypting other file..."
cat $3 | git-crypt smudge > "${other_decrypted}"
echo ""

echo "Merging ..."
git merge-file -L "current branch" -L "ancestor branch" -L "other branch" "${current_decrypted}" "${ancestor_decrypted}" "${other_decrypted}"
exit_code=$?
cat "${current_decrypted}" | git-crypt clean > $2

echo "Removing temporary files..."
rm "${other_decrypted}" "${ancestor_decrypted}" "${current_decrypted}"

if [ "$exit_code" -eq "0" ]
then
    echo "@@@ No conflict!"
else
    echo "@@@ You need to solve some conflicts..."
fi

exit $exit_code
