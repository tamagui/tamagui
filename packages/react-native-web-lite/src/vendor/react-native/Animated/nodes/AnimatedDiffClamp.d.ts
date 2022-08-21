export default AnimatedDiffClamp;
declare class AnimatedDiffClamp extends AnimatedWithChildren {
    constructor(a: any, min: any, max: any);
    _a: any;
    _min: any;
    _max: any;
    _value: any;
    _lastValue: any;
    interpolate(config: any): AnimatedInterpolation;
    __getValue(): any;
    __getNativeConfig(): {
        type: string;
        input: any;
        min: any;
        max: any;
    };
}
import AnimatedWithChildren from "./AnimatedWithChildren.js";
import AnimatedInterpolation from "./AnimatedInterpolation.js";
//# sourceMappingURL=AnimatedDiffClamp.d.ts.map