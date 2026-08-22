# Tamagui Language Service for VS Code

This companion extension registers `:` as a TSX completion trigger. VS Code's
built-in TypeScript completion provider does not register it, and a tsserver
plugin cannot add editor trigger characters.

The extension asks VS Code for its normal completion result and forwards only
items labeled by `@tamagui/language-service`. It contains no syntax heuristic,
Tamagui configuration, or completion logic. The tsserver plugin remains the
single source for locating a Tamagui prop, parsing the generated config,
traversing the modifier trie, and returning valid values and modifiers. At every
other colon the bridge returns nothing.
