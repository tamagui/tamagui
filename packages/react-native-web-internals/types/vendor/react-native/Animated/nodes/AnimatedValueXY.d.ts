export default AnimatedValueXY;
declare class AnimatedValueXY extends AnimatedWithChildren {
    constructor(valueIn: any);
    x: any;
    y: any;
    setValue(value: any): void;
    setOffset(offset: any): void;
    flattenOffset(): void;
    extractOffset(): void;
    __getValue(): {
        x: any;
        y: any;
    };
    resetAnimation(callback: any): void;
    stopAnimation(callback: any): void;
    getLayout(): {
        left: any;
        top: any;
    };
    getTranslateTransform(): ({
        translateX: any;
        translateY?: undefined;
    } | {
        translateY: any;
        translateX?: undefined;
    })[];
}
import AnimatedWithChildren from "./AnimatedWithChildren.js";
//# sourceMappingURL=AnimatedValueXY.d.ts.map