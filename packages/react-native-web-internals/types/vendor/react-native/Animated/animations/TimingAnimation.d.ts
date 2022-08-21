export default TimingAnimation;
declare class TimingAnimation extends Animation {
    constructor(config: any);
    _toValue: any;
    _easing: any;
    _duration: any;
    _delay: any;
    __iterations: any;
    _useNativeDriver: any;
    __isInteraction: any;
    __getNativeAnimationConfig(): {
        type: string;
        frames: any[];
        toValue: any;
        iterations: any;
    };
    __active: boolean | undefined;
    _fromValue: any;
    _onUpdate: any;
    _startTime: number | undefined;
    _animationFrame: number | undefined;
    _timeout: NodeJS.Timeout | undefined;
    onUpdate(): void;
}
import Animation from "./Animation.js";
//# sourceMappingURL=TimingAnimation.d.ts.map