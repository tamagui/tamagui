export default AnimatedModulo;
declare class AnimatedModulo extends AnimatedWithChildren {
    constructor(a: any, modulus: any);
    _a: any;
    _modulus: any;
    __getValue(): number;
    interpolate(config: any): AnimatedInterpolation;
    __getNativeConfig(): {
        type: string;
        input: any;
        modulus: any;
    };
}
import AnimatedWithChildren from "./AnimatedWithChildren.js";
import AnimatedInterpolation from "./AnimatedInterpolation.js";
//# sourceMappingURL=AnimatedModulo.d.ts.map