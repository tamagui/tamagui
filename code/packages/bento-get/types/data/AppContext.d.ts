import React from 'react';
import Conf from 'conf';
import type { ComponentSchema } from '../components.js';
export interface FetchState {
    status: 'idle' | 'loading' | 'success' | 'error';
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    data?: any;
    error?: Error;
    statusCode?: number;
}
export interface TokenStorageState {
    hasToken: boolean;
    token: string | null;
}
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
export interface AppContextType {
    tokenStore: Conf<any>;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    accessToken: string | null;
    setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
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
    installState: InstallState;
    exitApp: () => void;
    confirmationPending: boolean;
    setConfirmationPending: React.Dispatch<React.SetStateAction<boolean>>;
    fetchState: FetchState;
    setFetchState: React.Dispatch<React.SetStateAction<FetchState>>;
}
export declare const AppContext: React.Context<AppContextType>;
//# sourceMappingURL=AppContext.d.ts.map