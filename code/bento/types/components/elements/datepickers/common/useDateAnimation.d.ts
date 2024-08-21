export declare function useDateAnimation({ listenTo, }: {
    listenTo: 'year' | 'month' | 'years';
}): {
    prevNextAnimation: () => {
        enterStyle: {
            opacity: number;
            x?: undefined;
        };
        exitStyle?: undefined;
    } | {
        enterStyle: {
            opacity: number;
            x: number;
        };
        exitStyle: {
            opacity: number;
            x: number;
        };
    } | undefined;
    prevNextAnimationKey: string | number;
};
//# sourceMappingURL=useDateAnimation.d.ts.map