export default AnimatedStyle;
declare class AnimatedStyle extends AnimatedWithChildren {
    constructor(style: any);
    _style: any;
    _walkStyleAndGetValues(style: any): {};
    __getValue(): {};
    _walkStyleAndGetAnimatedValues(style: any): {};
    __getAnimatedValue(): {};
    __getNativeConfig(): {
        type: string;
        style: {};
    };
}
import AnimatedWithChildren from "./AnimatedWithChildren.js";
//# sourceMappingURL=AnimatedStyle.d.ts.map