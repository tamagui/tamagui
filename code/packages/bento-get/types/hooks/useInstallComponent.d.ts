import React from 'react';
import type { InstallState } from '../data/AppContext.js';
export declare const getMonorepoRoot: () => Promise<string>;
export declare const installComponent: ({ componentFiles, setInstallState, installState, }: {
    componentFiles: {
        [key: string]: Array<{
            path: string;
            filePlainText: string;
        }>;
    };
    setInstallState: React.Dispatch<React.SetStateAction<InstallState>>;
    installState: InstallState;
}) => Promise<void>;
export declare const useInstallComponent: () => {
    data: Record<string, {
        path: string;
        filePlainText: string;
    }[]> | undefined;
    error: any;
};
//# sourceMappingURL=useInstallComponent.d.ts.map