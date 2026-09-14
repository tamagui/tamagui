export interface SpringPhysics {
	stiffness: number;
	damping: number;
	mass: number;
}
export interface SpringCanonical {
	/** undamped period, in milliseconds */
	duration: number;
	bounce: number;
}
/** bounce -> damping ratio. bounce is exclusive of -1 and 1. */
export declare function bounceToDampingRatio(bounce: number): number;
/** damping ratio -> bounce. exact inverse of bounceToDampingRatio. */
export declare function dampingRatioToBounce(dampingRatio: number): number;
export declare function springFromDurationBounce({ duration, bounce }: SpringCanonical, mass?: number): SpringPhysics;
export declare function springToDurationBounce({ stiffness, damping, mass }: SpringPhysics): SpringCanonical;
/**
* normalized step response of a unit spring at time t (seconds): 0 at rest,
* 1 at target, overshooting past 1 when underdamped.
*/
export declare function springPosition({ duration, bounce }: SpringCanonical, timeSeconds: number): number;
/**
* an upper bound on |springPosition - 1| at time t (seconds). monotonically
* decreasing in every damping regime, which is what lets settle time bisect.
*
* bounding the ENVELOPE rather than the position matters for underdamped
* springs: the position crosses its target on every oscillation, so "first
* time within threshold" would report a zero crossing rather than the settle.
*/
export declare function springEnvelope({ duration, bounce }: SpringCanonical, timeSeconds: number): number;
/**
* time in ms until the spring stays within `threshold` of its target.
*
* the default 0.5% is the practical settle point: tighter thresholds buy only
* motion nobody can see while stretching transition-duration well past the
* point the element looks finished, which delays every completion callback
* hanging off it.
*
* css needs this and not `duration`: a `linear()` easing maps its samples
* across transition-duration, so the transition has to be as long as the
* motion actually lasts or the tail gets cut off mid-bounce.
*
* bisected rather than solved, because the critically damped envelope has no
* elementary inverse and the underdamped and overdamped closed forms both go
* singular as they approach it.
*/
/** how close to the target counts as settled */
export declare const SPRING_SETTLE_THRESHOLD: number;
export declare function springSettleTime(canonical: SpringCanonical, threshold?: number): number;
/**
* a spring as a css `linear()` easing plus the transition-duration to run it
* over, so springs work on the css driver with no javascript.
*
* `linear()` is Chrome 113+, Safari 17.2+, Firefox 112+.
*/
export declare function springToLinearEasing(canonical: SpringCanonical, sampleCount?: number): {
	easing: string;
	durationMs: number;
};

//# sourceMappingURL=spring.d.ts.map