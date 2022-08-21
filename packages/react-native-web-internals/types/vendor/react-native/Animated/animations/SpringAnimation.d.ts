export default SpringAnimation;
declare class SpringAnimation extends Animation {
    constructor(config: any);
    _overshootClamping: any;
    _restDisplacementThreshold: any;
    _restSpeedThreshold: any;
    _initialVelocity: any;
    _lastVelocity: any;
    _toValue: any;
    _delay: any;
    _useNativeDriver: any;
    __isInteraction: any;
    __iterations: any;
    _stiffness: any;
    _damping: any;
    _mass: any;
    __getNativeAnimationConfig(): {
        type: string;
        overshootClamping: any;
        restDisplacementThreshold: any;
        restSpeedThreshold: any;
        stiffness: any;
        damping: any;
        mass: any;
        initialVelocity: any;
        toValue: any;
        iterations: any;
    };
    __active: boolean | undefined;
    _startPosition: any;
    _lastPosition: any;
    _onUpdate: any;
    _lastTime: any;
    _frameTime: number | undefined;
    _timeout: NodeJS.Timeout | undefined;
    getInternalState(): any;
    onUpdate(): void;
    _animationFrame: number | undefined;
}
import Animation from "./Animation.js";
//# sourceMappingURL=SpringAnimation.d.ts.map