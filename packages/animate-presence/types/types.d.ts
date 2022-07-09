export interface Axis {
    min: number;
    max: number;
}
export interface Box {
    x: Axis;
    y: Axis;
}
export declare type VariantLabels = string | string[];
export interface AnimatePresenceProps {
    initial?: boolean;
    custom?: any;
    onExitComplete?: () => void;
    exitBeforeEnter?: boolean;
    presenceAffectsLayout?: boolean;
    exitVariant?: string | null;
    enterVariant?: string | null;
}
//# sourceMappingURL=types.d.ts.map