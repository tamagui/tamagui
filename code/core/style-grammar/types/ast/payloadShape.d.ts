export interface PayloadShapeDiagnostic {
	code: "multi-component-single-value";
	property: string;
	payload: string;
	message: string;
}
/**
* Returns a diagnostic when `payload` holds more than one top-level component
* for a longhand that takes exactly one. `hasBase` sharpens the message: with
* no base in the program, the most likely cause is a base written after a
* conditional and swallowed by its space-greedy payload.
*/
export declare function validatePayloadShape(property: string, payload: string, hasBase: boolean): PayloadShapeDiagnostic | null;

//# sourceMappingURL=payloadShape.d.ts.map