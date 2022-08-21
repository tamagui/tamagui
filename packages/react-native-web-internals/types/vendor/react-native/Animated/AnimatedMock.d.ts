declare namespace _default {
    export { AnimatedValue as Value };
    export { AnimatedValueXY as ValueXY };
    export { AnimatedInterpolation as Interpolation };
    export { AnimatedNode as Node };
    export { decay };
    export { timing };
    export { spring };
    export const add: (a: any, b: any) => import("./nodes/AnimatedAddition.js").default;
    export const subtract: (a: any, b: any) => import("./nodes/AnimatedSubtraction.js").default;
    export const divide: (a: any, b: any) => import("./nodes/AnimatedDivision.js").default;
    export const multiply: (a: any, b: any) => import("./nodes/AnimatedMultiplication.js").default;
    export const modulo: (a: any, modulus: any) => import("./nodes/AnimatedModulo.js").default;
    export const diffClamp: (a: any, min: any, max: any) => import("./nodes/AnimatedDiffClamp.js").default;
    export { delay };
    export { sequence };
    export { parallel };
    export { stagger };
    export { loop };
    export { event };
    export { createAnimatedComponent };
    export { attachNativeEvent };
    export const forkEvent: (event: any, listener: any) => any;
    export const unforkEvent: (event: any, listener: any) => void;
    export { AnimatedEvent as Event };
    export { AnimatedProps as __PropsOnlyForTests };
}
export default _default;
import AnimatedValue from "./nodes/AnimatedValue.js";
import AnimatedValueXY from "./nodes/AnimatedValueXY.js";
import AnimatedInterpolation from "./nodes/AnimatedInterpolation.js";
import AnimatedNode from "./nodes/AnimatedNode.js";
declare function decay(value: any, config: any): {
    start: () => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function timing(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function spring(value: any, config: any): {
    start: (callback: any) => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function delay(time: any): {
    start: () => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function sequence(animations: any): {
    start: () => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function parallel(animations: any, config: any): {
    start: () => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function stagger(time: any, animations: any): {
    start: () => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function loop(animation: any, _temp: any): {
    start: () => void;
    stop: () => void;
    reset: () => void;
    _startNativeLoop: () => void;
    _isUsingNativeDriver: () => boolean;
};
declare function event(argMapping: any, config: any): null;
import createAnimatedComponent from "./createAnimatedComponent.js";
import { attachNativeEvent } from "./AnimatedEvent.js";
import { AnimatedEvent } from "./AnimatedEvent.js";
import AnimatedProps from "./nodes/AnimatedProps.js";
//# sourceMappingURL=AnimatedMock.d.ts.map