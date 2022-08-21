export default AnimatedMultiplication;
declare class AnimatedMultiplication extends AnimatedWithChildren {
    constructor(a: any, b: any);
    _a: any;
    _b: any;
    __getValue(): number;
    interpolate(config: any): AnimatedInterpolation;
    __getNativeConfig(): {
        type: string;
        input: any[];
    };
}
import AnimatedWithChildren from "./AnimatedWithChildren.js";
import AnimatedInterpolation from "./AnimatedInterpolation.js";
//# sourceMappingURL=AnimatedMultiplication.d.ts.map