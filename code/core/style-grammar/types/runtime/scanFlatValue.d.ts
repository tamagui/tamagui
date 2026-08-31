export type FlatScanErrorCode = "invalid-character" | "unterminated-string" | "unterminated-function" | "unterminated-comment" | "stray-comment-close";
export type FlatScanFailure = FlatScanErrorCode | "refused-chain";
export interface FlatValueHandler<Context> {
	modifier?(ctx: Context, start: number, end: number, valid: boolean, first: boolean, source: string, a: any, b: any, c: any, d: any): boolean | void;
	segment(ctx: Context, start: number, end: number, isBase: boolean, valid: boolean, source: string, chainStart: number, chainEnd: number, chainValid: boolean, chainCount: number, result: number, failure: FlatScanFailure | null, failureIndex: number, a: any, b: any, c: any, d: any): number | void;
	chain(ctx: Context, start: number, end: number, valid: boolean): boolean;
	error?(ctx: Context, code: FlatScanErrorCode, index: number): void;
	word?(ctx: Context, start: number, end: number, isChain: boolean): void;
	end?(ctx: Context, source: string, result: number, lastAcceptedStart: number, chainCount: number, a: any, b: any, c: any, d: any, failure: FlatScanFailure | null, failureIndex: number): void;
}
export type ParsedFlatValue = [segments: readonly number[], failure: FlatScanFailure | null, failureIndex: number];
export declare function scanFlatValue<Context>(source: string, handler: FlatValueHandler<Context>, ctx: Context, a?: any, b?: any, c?: any, d?: any): FlatScanFailure | null;
export declare function parseFlatValue(source: string): ParsedFlatValue;

//# sourceMappingURL=scanFlatValue.d.ts.map