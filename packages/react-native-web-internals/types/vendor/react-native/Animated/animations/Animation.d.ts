export default Animation;
declare class Animation {
    start(fromValue: any, onUpdate: any, onEnd: any, previousAnimation: any, animatedValue: any): void;
    stop(): void;
    __getNativeAnimationConfig(): void;
    __debouncedOnEnd(result: any): void;
    __onEnd: any;
    __startNativeAnimation(animatedValue: any): void;
    __nativeId: number | undefined;
}
//# sourceMappingURL=Animation.d.ts.map