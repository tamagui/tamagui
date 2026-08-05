export interface CandidateContribution {
	property: string;
}
export interface CandidatePropertyMismatch {
	code: "candidate-property-mismatch";
	candidate: string;
	property: string;
	contributedProperties: readonly string[];
	message: string;
}
export type CandidateTargetResult<Contribution extends CandidateContribution> = {
	ok: true;
	contribution: Contribution;
} | {
	ok: false;
	diagnostic: CandidatePropertyMismatch;
};
/**
* selects the contribution addressed by an overloaded family prop.
*
* candidate resolution happens before this function, so both the compiler and
* runtime pass the same family contributions here. A candidate is valid only
* when it contributes to the authored property itself. This keeps shared
* families such as `text-*` from accepting a color candidate for `fontSize`,
* or a font-size candidate for `color`.
*/
export declare function resolveCandidateTarget<Contribution extends CandidateContribution>(property: string, candidate: string, contributions: readonly Contribution[]): CandidateTargetResult<Contribution>;

//# sourceMappingURL=candidateTarget.d.ts.map