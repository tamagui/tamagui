import React from 'react';
import type { InstallState } from '../commands/index.js';
export declare const getMonorepoRoot: () => Promise<string>;
export declare const installComponent: ({ component, setInstallState, installState, }: {
    component: string;
    setInstallState: React.Dispatch<React.SetStateAction<InstallState>>;
    installState: InstallState;
}) => Promise<void>;
export declare const useInstallComponent: () => {
    data: string | undefined;
    error: any;
};
//# sourceMappingURL=useInstallComponent.d.ts.map