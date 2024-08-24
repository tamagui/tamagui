import Conf from 'conf';
import React from 'react';
import type { ComponentSchema } from '../components.js';
export declare const debugLog: (...args: any[]) => void;
export interface InstallState {
    installingComponent: ComponentSchema | null | undefined;
    installedComponents: ComponentSchema[];
    shouldOpenBrowser: boolean;
    isTokenInstalled: boolean;
    componentToInstall: {
        name: string;
        path: string;
    } | null;
}
export type AppScreen = '/search' | '/install' | '/auth' | '/install-confirm' | '/package-install-command';
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
    confirmationPending: boolean;
    setConfirmationPending: React.Dispatch<React.SetStateAction<boolean>>;
}
export declare const AppContext: React.Context<AppContextType>;
export default function App(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map