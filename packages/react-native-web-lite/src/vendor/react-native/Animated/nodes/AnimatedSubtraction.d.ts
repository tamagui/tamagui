export default AnimatedSubtraction;
declare class AnimatedSubtraction extends AnimatedWithChildren {
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
//# sourceMappingURL=AnimatedSubtraction.d.ts.map