import * as React from 'react';
import { VariantLabels } from './types';
interface PresenceChildProps {
    children: React.ReactElement<any>;
    isEntering: boolean | undefined;
    onExitComplete?: () => void;
    initial?: false | VariantLabels;
    exitVariant?: string | null;
    enterVariant?: string | null;
    presenceAffectsLayout: boolean;
}
export declare const PresenceChild: ({ children, initial, isEntering, onExitComplete, exitVariant, enterVariant, presenceAffectsLayout, }: PresenceChildProps) => JSX.Element;
export {};
//# sourceMappingURL=PresenceChild.d.ts.map