export default AnimatedDivision;
declare class AnimatedDivision extends AnimatedWithChildren {
    constructor(a: any, b: any);
    _warnedAboutDivideByZero: boolean;
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
//# sourceMappingURL=AnimatedDivision.d.ts.map