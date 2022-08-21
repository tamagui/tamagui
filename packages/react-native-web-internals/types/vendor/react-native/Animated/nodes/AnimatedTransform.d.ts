export default AnimatedTransform;
declare class AnimatedTransform extends AnimatedWithChildren {
    constructor(transforms: any);
    _transforms: any;
    __getValue(): any;
    __getAnimatedValue(): any;
    __getNativeConfig(): {
        type: string;
        transforms: any[];
    };
}
import AnimatedWithChildren from "./AnimatedWithChildren.js";
//# sourceMappingURL=AnimatedTransform.d.ts.map