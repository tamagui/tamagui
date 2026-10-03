/** the shared table plus the two this config adds, in one place for both drivers */
export declare const presets: {
    quickest: {
        readonly duration: 120;
        readonly bounce: 0.2;
    };
    quickestLessBouncy: {
        readonly duration: 120;
        readonly bounce: 0;
    };
    quicker: {
        readonly duration: 160;
        readonly bounce: 0.25;
    };
    quickerLessBouncy: {
        readonly duration: 160;
        readonly bounce: 0;
    };
    quick: {
        readonly duration: 220;
        readonly bounce: 0.3;
    };
    quickLessBouncy: {
        readonly duration: 220;
        readonly bounce: 0;
    };
    medium: {
        readonly duration: 300;
        readonly bounce: 0.15;
    };
    slow: {
        readonly duration: 450;
        readonly bounce: 0.1;
    };
    slowest: {
        readonly duration: 700;
        readonly bounce: 0.1;
    };
    lazy: {
        readonly duration: 500;
        readonly bounce: -0.2;
    };
    superLazy: {
        readonly duration: 800;
        readonly bounce: -0.3;
    };
    bouncy: {
        readonly duration: 400;
        readonly bounce: 0.5;
    };
    superBouncy: {
        readonly duration: 400;
        readonly bounce: 0.75;
    };
    tooltip: {
        duration: number;
        bounce: number;
    };
    select: {
        duration: number;
        bounce: number;
    };
};
//# sourceMappingURL=presets.d.ts.map