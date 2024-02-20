import * as React from 'react';
import type { VariantLabels } from './types';
interface PresenceChildProps {
    children: React.ReactElement<any>;
    isPresent: boolean;
    onExitComplete?: () => void;
    initial?: false | VariantLabels;
    custom?: any;
    presenceAffectsLayout: boolean;
    exitVariant?: string | null;
    enterVariant?: string | null;
    enterExitVariant?: string | null;
}
export declare const PresenceChild: React.MemoExoticComponent<({ children, initial, isPresent, onExitComplete, exitVariant, enterVariant, enterExitVariant, presenceAffectsLayout, custom, }: PresenceChildProps) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=PresenceChild.d.ts.map