import React from 'react';
export interface FocusScopeProps {
    loop?: boolean;
    trapped?: boolean;
    onMountAutoFocus?: (event: Event) => void;
    onUnmountAutoFocus?: (event: Event) => void;
    forceUnmount?: boolean;
    children?: React.ReactNode;
}
//# sourceMappingURL=FocusScopeProps.d.ts.map