import type { CompatibilityRow } from "./types";
/**
* Every deliberate difference between the Tamagui DOM contract and the pinned
* React Strict DOM release.
*
* The conformance test walks the RSD snapshot against the tables and requires
* the keys claimed here to be exactly the differences it finds: an unclaimed
* difference and a claim that is no longer a difference both fail. So this file
* cannot drift in either direction, and refreshing the pin
* (`bun scripts/extract-rsd-snapshot.ts`) surfaces whatever changed as a test
* failure naming the exact key. Every key is spelled out for the same reason
* — a pattern would quietly absorb the next element that starts differing.
*
* Style keys are `<platform>.<tag>.<property>`. Prop and event keys are the
* prop name. A key belongs to exactly one row.
*/
/**
* The pinned reference. The conformance test asserts this matches the snapshot,
* so refreshing the pin without updating this line fails.
*/
export declare const RSD_REFERENCE: Readonly<{
	version: string;
	commit: string;
	date: string;
}>;
export declare const COMPATIBILITY: readonly CompatibilityRow[];

//# sourceMappingURL=compatibility.d.ts.map