import React from 'react';
import type { InstallState } from '../commands/index.js';
export declare const installComponent: ({ component, setInstall, install, }: {
    component: string;
    setInstall: React.Dispatch<React.SetStateAction<InstallState>>;
    install: InstallState;
}) => Promise<void>;
export declare const useInstallComponent: () => {
    data: string | undefined;
    error: any;
};
//# sourceMappingURL=useInstallComponent.d.ts.map