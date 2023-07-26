check_for_test_only () {
    grep -r --include="**/*.test.ts*" 'test' ./
}

if check_for_test_only; then
    echo "found case using test.only"
    exit 1
else
    echo "all good"
    exit 0
fi