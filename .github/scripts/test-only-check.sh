check_for_test_only () {
    grep -r --include="**/*.test.ts*" 'test.only' ./
}

if check_for_test_only; then
    exit 1
else
    exit 0
fi