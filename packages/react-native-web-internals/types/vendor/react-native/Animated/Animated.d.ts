export const Animated: {
    Value: typeof import("./nodes/AnimatedValue.js").default;
    ValueXY: typeof import("./nodes/AnimatedValueXY.js").default;
    Interpolation: typeof import("./nodes/AnimatedInterpolation.js").default;
    Node: typeof import("./nodes/AnimatedNode.js").default;
    decay: (value: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: (iterations: any) => void;
        _isUsingNativeDriver: () => any;
    };
    timing: (value: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: (iterations: any) => void;
        _isUsingNativeDriver: () => any;
    };
    spring: (value: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: (iterations: any) => void;
        _isUsingNativeDriver: () => any;
    };
    add: (a: any, b: any) => import("./nodes/AnimatedAddition.js").default;
    subtract: (a: any, b: any) => import("./nodes/AnimatedSubtraction.js").default;
    divide: (a: any, b: any) => import("./nodes/AnimatedDivision.js").default;
    multiply: (a: any, b: any) => import("./nodes/AnimatedMultiplication.js").default;
    modulo: (a: any, modulus: any) => import("./nodes/AnimatedModulo.js").default;
    diffClamp: (a: any, min: any, max: any) => import("./nodes/AnimatedDiffClamp.js").default;
    delay: (time: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: (iterations: any) => void;
        _isUsingNativeDriver: () => any;
    };
    sequence: (animations: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => never;
        _isUsingNativeDriver: () => boolean;
    };
    parallel: (animations: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => never;
        _isUsingNativeDriver: () => boolean;
    };
    stagger: (time: any, animations: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => never;
        _isUsingNativeDriver: () => boolean;
    };
    loop: (animation: any, _temp: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => never;
        _isUsingNativeDriver: () => any;
    };
    event: (argMapping: any, config: any) => import("./AnimatedEvent.js").AnimatedEvent | ((...args: any[]) => void);
    createAnimatedComponent: typeof import("./createAnimatedComponent.js").default;
    attachNativeEvent: typeof import("./AnimatedEvent.js").attachNativeEvent;
    forkEvent: (event: any, listener: any) => any;
    unforkEvent: (event: any, listener: any) => void;
    Event: typeof import("./AnimatedEvent.js").AnimatedEvent;
    __PropsOnlyForTests: typeof import("./nodes/AnimatedProps.js").default;
    Platform: {
        OS: string;
        select: (obj: any) => any;
        isTesting: boolean;
    };
    Image: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
    ScrollView: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
    Text: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
    View: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
} | {
    Value: typeof import("./nodes/AnimatedValue.js").default;
    ValueXY: typeof import("./nodes/AnimatedValueXY.js").default;
    Interpolation: typeof import("./nodes/AnimatedInterpolation.js").default;
    Node: typeof import("./nodes/AnimatedNode.js").default;
    decay: (value: any, config: any) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    timing: (value: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    spring: (value: any, config: any) => {
        start: (callback: any) => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    add: (a: any, b: any) => import("./nodes/AnimatedAddition.js").default;
    subtract: (a: any, b: any) => import("./nodes/AnimatedSubtraction.js").default;
    divide: (a: any, b: any) => import("./nodes/AnimatedDivision.js").default;
    multiply: (a: any, b: any) => import("./nodes/AnimatedMultiplication.js").default;
    modulo: (a: any, modulus: any) => import("./nodes/AnimatedModulo.js").default;
    diffClamp: (a: any, min: any, max: any) => import("./nodes/AnimatedDiffClamp.js").default;
    delay: (time: any) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    sequence: (animations: any) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    parallel: (animations: any, config: any) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    stagger: (time: any, animations: any) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    loop: (animation: any, _temp: any) => {
        start: () => void;
        stop: () => void;
        reset: () => void;
        _startNativeLoop: () => void;
        _isUsingNativeDriver: () => boolean;
    };
    event: (argMapping: any, config: any) => null;
    createAnimatedComponent: typeof import("./createAnimatedComponent.js").default;
    attachNativeEvent: typeof import("./AnimatedEvent.js").attachNativeEvent;
    forkEvent: (event: any, listener: any) => any;
    unforkEvent: (event: any, listener: any) => void;
    Event: typeof import("./AnimatedEvent.js").AnimatedEvent;
    __PropsOnlyForTests: typeof import("./nodes/AnimatedProps.js").default;
    Platform: {
        OS: string;
        select: (obj: any) => any;
        isTesting: boolean;
    };
    Image: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
    ScrollView: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
    Text: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
    View: import("react").ForwardRefExoticComponent<import("react").RefAttributes<unknown>>;
};
//# sourceMappingURL=Animated.d.ts.map