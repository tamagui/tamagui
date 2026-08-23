export type FlatScanErrorCode = "invalid-character" | "unterminated-string" | "unterminated-function" | "unterminated-comment" | "stray-comment-close";
/** why a scan stopped short, or null when it ran to the end cleanly */
export type FlatScanFailure = FlatScanErrorCode | "refused-chain";
export interface FlatValueHandler<Context> {
	/**
	* The base, or one clause's payload, just ended. `start` and `end` are
	* already trimmed, and `start === end` means the segment is empty: an empty
	* base is simply no base, an empty payload is a clause with nothing in it.
	* `valid` is false when this segment contains a lexical error.
	*/
	segment(ctx: Context, start: number, end: number, isBase: boolean, valid: boolean): void;
	/**
	* A modifier chain just ended, without its trailing colon, so
	* `source.slice(start, end)` is `dark:hover` for `dark:hover:red`. `valid` is
	* false when the chain word itself contains a lexical error. Returning false
	* stops the scan.
	*/
	chain(ctx: Context, start: number, end: number, valid: boolean): boolean;
	/**
	* A character the grammar refuses, or a delimiter left open at the end. The
	* scan continues, so a consumer that only wants the first one records it and
	* uses the segment validity bit to refuse the affected segment.
	*/
	error?(ctx: Context, code: FlatScanErrorCode, index: number): void;
	/** every top-level word, whether or not it turned out to carry a chain */
	word?(ctx: Context, start: number, end: number, isChain: boolean): void;
}
export declare function scanFlatValue<Context>(source: string, handler: FlatValueHandler<Context>, ctx: Context): FlatScanFailure | null;

//# sourceMappingURL=scanFlatValue.d.ts.map