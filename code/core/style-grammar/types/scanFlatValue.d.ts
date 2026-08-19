export type FlatScanErrorCode = "invalid-character" | "unterminated-string" | "unterminated-function" | "unterminated-comment" | "stray-comment-close";
/** why a scan stopped short, or null when it ran to the end cleanly */
export type FlatScanFailure = FlatScanErrorCode | "refused-chain";
export interface FlatValueVisitor {
	/**
	* The base, or one clause's payload, just ended. `start` and `end` are
	* already trimmed, and `start === end` means the segment is empty: an empty
	* base is simply no base, an empty payload is a clause with nothing in it.
	*/
	segment(start: number, end: number, isBase: boolean): void;
	/**
	* A modifier chain just ended, without its trailing colon, so
	* `source.slice(start, end)` is `dark:hover` for `dark:hover:red`. Returning
	* false stops the scan: the consumer has refused the value and does not want
	* later chains resolved.
	*/
	chain(start: number, end: number): boolean;
	/**
	* A character the grammar refuses, or a delimiter left open at the end. The
	* scan continues, so a consumer that only wants the first one records it and
	* refuses the next chain.
	*/
	error?(code: FlatScanErrorCode, index: number): void;
	/** every top-level word, whether or not it turned out to carry a chain */
	word?(start: number, end: number, isChain: boolean): void;
}
export declare function scanFlatValue(source: string, visitor: FlatValueVisitor): FlatScanFailure | null;

//# sourceMappingURL=scanFlatValue.d.ts.map