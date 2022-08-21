export default AnimatedValue;
declare class AnimatedValue extends AnimatedWithChildren {
    constructor(value: any);
    _startingValue: number;
    _value: number;
    _offset: number;
    _animation: any;
    __getValue(): number;
    setValue(value: any): void;
    setOffset(offset: any): void;
    flattenOffset(): void;
    extractOffset(): void;
    stopAnimation(callback: any): void;
    resetAnimation(callback: any): void;
    interpolate(config: any): AnimatedInterpolation;
    animate(animation: any, callback: any): void;
    stopTracking(): void;
    _tracking: any;
    track(tracking: any): void;
    _updateValue(value: any, flush: any): void;
    __getNativeConfig(): {
        type: string;
        value: number;
        offset: number;
    };
}
import AnimatedWithChildren from "./AnimatedWithChildren.js";
import AnimatedInterpolation from "./AnimatedInterpolation.js";
//# sourceMappingURL=AnimatedValue.d.ts.map