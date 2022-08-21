export default AnimatedAddition;
declare class AnimatedAddition extends AnimatedWithChildren {
    constructor(a: any, b: any);
    _a: any;
    _b: any;
    __getValue(): any;
    interpolate(config: any): AnimatedInterpolation;
    __getNativeConfig(): {
        type: string;
        input: any[];
    };
}
import AnimatedWithChildren from "./AnimatedWithChildren.js";
import AnimatedInterpolation from "./AnimatedInterpolation.js";
//# sourceMappingURL=AnimatedAddition.d.ts.map