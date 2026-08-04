# `@tamagui/style-grammar`

This package owns the shared parser and intermediate representation for
Tamagui style value strings.

Runtime consumers must follow the repository's
[one-parse-per-unique-value constraint](../../../CONTRIBUTING.md#style-value-parsing-one-parse-per-unique-value).
Cache the parsed representation and extend it with structural predicates when
a new consumer needs more information. Do not add a second string scanner
beside the grammar.
