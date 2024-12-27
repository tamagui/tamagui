import type { PresenceVariantLabels } from '@tamagui/web';
import * as React from 'react';
interface PresenceChildProps {
    children: React.ReactElement;
    isPresent: boolean;
    onExitComplete?: () => void;
    initial?: false | PresenceVariantLabels;
    custom?: any;
    presenceAffectsLayout: boolean;
    mode: 'sync' | 'popLayout' | 'wait';
    exitVariant?: string | null;
    enterVariant?: string | null;
    enterExitVariant?: string | null;
}
export declare const PresenceChild: ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, enterExitVariant, enterVariant, exitVariant, }: PresenceChildProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PresenceChild.d.ts.map