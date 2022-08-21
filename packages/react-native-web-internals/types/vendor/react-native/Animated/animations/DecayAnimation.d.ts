export default DecayAnimation;
declare class DecayAnimation extends Animation {
    constructor(config: any);
    _deceleration: any;
    _velocity: any;
    _useNativeDriver: any;
    __isInteraction: any;
    __iterations: any;
    __getNativeAnimationConfig(): {
        type: string;
        deceleration: any;
        velocity: any;
        iterations: any;
    };
    __active: boolean | undefined;
    _lastValue: any;
    _fromValue: any;
    _onUpdate: any;
    _startTime: number | undefined;
    _animationFrame: number | undefined;
    onUpdate(): void;
}
import Animation from "./Animation.js";
//# sourceMappingURL=DecayAnimation.d.ts.map