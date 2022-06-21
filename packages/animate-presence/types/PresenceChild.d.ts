import * as React from 'react';
import { VariantLabels } from './types';
interface PresenceChildProps {
    children: React.ReactElement<any>;
    isPresent: boolean;
    onExitComplete?: () => void;
    initial?: false | VariantLabels;
    custom?: any;
    presenceAffectsLayout: boolean;
    exitVariant?: string | null;
    enterVariant?: string | null;
}
export declare const PresenceChild: ({ children, initial, isPresent, onExitComplete, exitVariant, enterVariant, presenceAffectsLayout, }: PresenceChildProps) => JSX.Element;
export {};
//# sourceMappingURL=PresenceChild.d.ts.map