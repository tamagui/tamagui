/** `<platform> <arch>` plus ` glibc`/` musl` on linux */
export declare function platformKey(): string
/**
 * Absolute path to the tamagui-lsp executable, or throws with a fix.
 *
 * `TAMAGUI_LSP_BINARY` overrides it, for working on this repo or for a platform
 * with no prebuilt binary. A path that does not exist throws rather than
 * falling back to the packaged binary.
 */
export declare function binaryPath(): string
