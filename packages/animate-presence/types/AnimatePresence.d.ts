import React from 'react';
export interface AnimatePresenceProps {
    initial?: boolean;
    exitVariant?: string | null;
    enterVariant?: string | null;
    onExitComplete?: () => void;
    exitBeforeEnter?: boolean;
    presenceAffectsLayout?: boolean;
}
export declare const AnimatePresence: React.FunctionComponent<React.PropsWithChildren<AnimatePresenceProps>>;
//# sourceMappingURL=AnimatePresence.d.ts.map