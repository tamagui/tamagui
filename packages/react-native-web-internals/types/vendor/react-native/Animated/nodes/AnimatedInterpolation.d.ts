export default AnimatedInterpolation;
declare class AnimatedInterpolation extends AnimatedWithChildren {
    constructor(parent: any, config: any);
    _parent: any;
    _config: any;
    _interpolation: (input: any) => any;
    __getValue(): any;
    interpolate(config: any): AnimatedInterpolation;
    __transformDataType(range: any): any;
    __getNativeConfig(): {
        inputRange: any;
        outputRange: any;
        extrapolateLeft: any;
        extrapolateRight: any;
        type: string;
    };
}
declare namespace AnimatedInterpolation {
    export { createInterpolation as __createInterpolation };
}
import AnimatedWithChildren from "./AnimatedWithChildren.js";
declare function createInterpolation(config: any): (input: any) => any;
//# sourceMappingURL=AnimatedInterpolation.d.ts.map