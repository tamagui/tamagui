/**
* The shipped animation presets, defined once for every driver.
*
* Before v3 each driver carried its own hand-tuned table, so `bouncy` was a
* 350ms cubic-bezier on the web, a stiffness-120 spring on react-native, and a
* stiffness-90 spring on motion. Three different motions under one name.
*
* They are springs in the canonical pair instead:
*
* - `duration` is the spring's undamped period, which is what "how fast does
*   this feel" actually means. It is not a stopwatch: a bouncy spring keeps
*   ringing past it, which is the point of a bouncy spring.
* - `bounce` is 0 for critically damped (fast, no overshoot), up toward 1 for
*   loose and oscillating, and negative for sluggish.
*
* On the web these compile to a `linear()` easing that traces the real spring
* curve, overshoot included, with no javascript running.
*
* There are no `'200ms'`-style presets any more. A duration is CSS now, so
* `transition="200ms"` and `transition="200ms ease-out"` work directly and
* need nothing configured. Keep your own table small for the same reason:
* a name is worth having only when it means something a duration cannot say.
*/
export declare const animationPresets: {
	readonly quickest: {
		readonly duration: 120;
		readonly bounce: 0.2;
	};
	readonly quickestLessBouncy: {
		readonly duration: 120;
		readonly bounce: 0;
	};
	readonly quicker: {
		readonly duration: 160;
		readonly bounce: 0.25;
	};
	readonly quickerLessBouncy: {
		readonly duration: 160;
		readonly bounce: 0;
	};
	readonly quick: {
		readonly duration: 220;
		readonly bounce: 0.3;
	};
	readonly quickLessBouncy: {
		readonly duration: 220;
		readonly bounce: 0;
	};
	readonly medium: {
		readonly duration: 300;
		readonly bounce: 0.15;
	};
	readonly slow: {
		readonly duration: 450;
		readonly bounce: 0.1;
	};
	readonly slowest: {
		readonly duration: 700;
		readonly bounce: 0.1;
	};
	readonly lazy: {
		readonly duration: 500;
		readonly bounce: -0.2;
	};
	readonly superLazy: {
		readonly duration: 800;
		readonly bounce: -0.3;
	};
	readonly bouncy: {
		readonly duration: 400;
		readonly bounce: 0.5;
	};
	readonly superBouncy: {
		readonly duration: 400;
		readonly bounce: 0.75;
	};
};

//# sourceMappingURL=presets.d.ts.map