import { ScaleTypeName } from './types';
export type ScaleType<A extends ScaleTypeName = ScaleTypeName> = {
    name: string;
    createdFrom?: A;
    lumScale?: {
        light: Array<number>;
        dark: Array<number>;
    };
    satScale?: {
        light: Array<number>;
        dark: Array<number>;
    };
};
export declare function getScalePreset<Name extends ScaleTypeName>(a: Name): (typeof scaleTypes)[Name];
export declare const scaleTypes: {
    custom: {
        name: string;
        createdFrom: "custom";
    };
    radix: {
        name: string;
        createdFrom: "radix";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
    'radix-b': {
        name: string;
        createdFrom: "radix-b";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
    'radius-bright': {
        name: string;
        createdFrom: "radius-bright";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
    'radius-bold': {
        name: string;
        createdFrom: "radius-bold";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
    linear: {
        name: string;
        createdFrom: "linear";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
    neon: {
        name: string;
        createdFrom: "neon";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
    'neon-bright': {
        name: string;
        createdFrom: "neon-bright";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
    'neon-c': {
        name: string;
        createdFrom: "neon-c";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
    pastel: {
        name: string;
        createdFrom: "pastel";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
    'pastel-desaturating': {
        name: string;
        createdFrom: "pastel-desaturating";
        lumScale: {
            light: number[];
            dark: number[];
        };
        satScale: {
            light: number[];
            dark: number[];
        };
    };
};
//# sourceMappingURL=buildThemeSuiteScales.d.ts.map