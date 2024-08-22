import Conf from 'conf';
import React from 'react';
import type { ComponentSchema } from '../components.js';
export interface InstallState {
    installingComponent: ComponentSchema | null | undefined;
    installedComponents: ComponentSchema[];
    enterToOpenBrowser: boolean;
    tokenIsInstalled: boolean;
}
interface AppContextType {
    tokenStore: Conf<any>;
    copyToClipboard: boolean;
    setCopyToClipboard: React.Dispatch<React.SetStateAction<boolean>>;
    results: Array<{
        item: ComponentSchema;
    }>;
    setResults: React.Dispatch<React.SetStateAction<Array<{
        item: ComponentSchema;
    }>>>;
    selectedId: number;
    setSelectedId: React.Dispatch<React.SetStateAction<number>>;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    setInstall: React.Dispatch<React.SetStateAction<InstallState>>;
    setInstallcomponent: React.Dispatch<React.SetStateAction<ComponentSchema>>;
    install: InstallState;
    exit: () => void;
}
export declare const AppContext: React.Context<AppContextType>;
export default function Search(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map