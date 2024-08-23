import React from 'react';
import Conf from 'conf';
import type { ComponentSchema } from '../components.js';
export interface InstallState {
    installingComponent: ComponentSchema | null | undefined;
    installedComponents: ComponentSchema[];
    shouldOpenBrowser: boolean;
    isTokenInstalled: boolean;
}
interface AppContextType {
    tokenStore: Conf<any>;
    isCopyingToClipboard: boolean;
    setCopyingToClipboard: React.Dispatch<React.SetStateAction<boolean>>;
    searchResults: Array<{
        item: ComponentSchema;
    }>;
    setSearchResults: React.Dispatch<React.SetStateAction<Array<{
        item: ComponentSchema;
    }>>>;
    selectedResultIndex: number;
    setSelectedResultIndex: React.Dispatch<React.SetStateAction<number>>;
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    setInstallState: React.Dispatch<React.SetStateAction<InstallState>>;
    setInstallingComponent: React.Dispatch<React.SetStateAction<ComponentSchema>>;
    installState: InstallState;
    exitApp: () => void;
}
export declare const AppContext: React.Context<AppContextType>;
export default function Search(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map