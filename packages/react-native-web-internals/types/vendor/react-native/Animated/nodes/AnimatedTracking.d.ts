export default AnimatedTracking;
declare class AnimatedTracking extends AnimatedNode {
    constructor(value: any, parent: any, animationClass: any, animationConfig: any, callback: any);
    _value: any;
    _parent: any;
    _animationClass: any;
    _animationConfig: any;
    _useNativeDriver: any;
    _callback: any;
    __isNative: boolean | undefined;
    __getValue(): any;
    update(): void;
    __getNativeConfig(): {
        type: string;
        animationId: number;
        animationConfig: any;
        toValue: any;
        value: any;
    };
}
import AnimatedNode from "./AnimatedNode.js";
//# sourceMappingURL=AnimatedTracking.d.ts.map