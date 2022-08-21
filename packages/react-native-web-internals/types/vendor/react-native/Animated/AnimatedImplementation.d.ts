declare namespace _default {
    export { AnimatedValue as Value };
    export { AnimatedValueXY as ValueXY };
    export { AnimatedInterpolation as Interpolation };
    export { AnimatedNode as Node };
    export { decay };
    export { timing };
    export { spring };
    export { add };
    export { subtract };
    export { divide };
    export { multiply };
    export { modulo };
    export { diffClamp };
    export { delay };
    export { sequence };
    export { parallel };
    export { stagger };
    export { loop };
    export { event };
    export { createAnimatedComponent };
    export { attachNativeEvent };
    export { forkEvent };
    export { unforkEvent };
    export { AnimatedEvent as Event };
    export { AnimatedProps as __PropsOnlyForTests };
}
export default _default;
import AnimatedValue from "./nodes/AnimatedValue.js";
import AnimatedValueXY from "./nodes/AnimatedValueXY.js";
import AnimatedInterpolation from "./nodes/AnimatedInterpolation.js";
import AnimatedNode from "./nodes/AnimatedNode.js";
declare function decay(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: (iterations: any) => void;
    _isUsingNativeDriver: () => any;
};
declare function timing(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: (iterations: any) => void;
    _isUsingNativeDriver: () => any;
};
declare function spring(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: (iterations: any) => void;
    _isUsingNativeDriver: () => any;
};
declare function add(a: any, b: any): AnimatedAddition;
declare function subtract(a: any, b: any): AnimatedSubtraction;
declare function divide(a: any, b: any): AnimatedDivision;
declare function multiply(a: any, b: any): AnimatedMultiplication;
declare function modulo(a: any, modulus: any): AnimatedModulo;
declare function diffClamp(a: any, min: any, max: any): AnimatedDiffClamp;
declare function delay(time: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: (iterations: any) => void;
    _isUsingNativeDriver: () => any;
};
declare function sequence(animations: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
};
declare function parallel(animations: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
};
declare function stagger(time: any, animations: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => boolean;
};
declare function loop(animation: any, _temp: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => never;
    _isUsingNativeDriver: () => any;
};
declare function event(argMapping: any, config: any): AnimatedEvent | ((...args: any[]) => void);
import createAnimatedComponent from "./createAnimatedComponent.js";
import { attachNativeEvent } from "./AnimatedEvent.js";
declare function forkEvent(event: any, listener: any): any;
declare function unforkEvent(event: any, listener: any): void;
import { AnimatedEvent } from "./AnimatedEvent.js";
import AnimatedProps from "./nodes/AnimatedProps.js";
import AnimatedAddition from "./nodes/AnimatedAddition.js";
import AnimatedSubtraction from "./nodes/AnimatedSubtraction.js";
import AnimatedDivision from "./nodes/AnimatedDivision.js";
import AnimatedMultiplication from "./nodes/AnimatedMultiplication.js";
import AnimatedModulo from "./nodes/AnimatedModulo.js";
import AnimatedDiffClamp from "./nodes/AnimatedDiffClamp.js";
//# sourceMappingURL=AnimatedImplementation.d.ts.map