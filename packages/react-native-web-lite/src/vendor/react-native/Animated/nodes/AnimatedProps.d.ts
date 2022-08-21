export default AnimatedProps;
declare class AnimatedProps extends AnimatedNode {
    constructor(props: any, callback: any);
    _props: any;
    _callback: any;
    __getValue(): {};
    __getAnimatedValue(): {};
    update(): void;
    __isNative: boolean | undefined;
    setNativeView(animatedView: any): void;
    _animatedView: any;
    __connectAnimatedView(): void;
    __disconnectAnimatedView(): void;
    __restoreDefaultValues(): void;
    __getNativeConfig(): {
        type: string;
        props: {};
    };
}
import AnimatedNode from "./AnimatedNode.js";
//# sourceMappingURL=AnimatedProps.d.ts.map