import { ReactNode } from 'react';
import React from 'react';
declare enum ACTIONS {
    REGISTER_HOST = 0,
    DEREGISTER_HOST = 1,
    ADD_UPDATE_PORTAL = 2,
    REMOVE_PORTAL = 3
}
declare const INITIAL_STATE: {};
export { ACTIONS, INITIAL_STATE };
export interface AddUpdatePortalAction {
    type: ACTIONS;
    hostName: string;
    portalName: string;
    node: ReactNode;
}
export interface RemovePortalAction {
    type: ACTIONS;
    hostName: string;
    portalName: string;
}
export interface RegisterHostAction {
    type: ACTIONS;
    hostName: string;
}
export interface UnregisterHostAction {
    type: ACTIONS;
    hostName: string;
}
export declare type ActionTypes = AddUpdatePortalAction | RemovePortalAction | RegisterHostAction | UnregisterHostAction;
export declare const usePortal: (hostName?: string) => {
    registerHost: () => void;
    deregisterHost: () => void;
    addPortal: (name: string, node: ReactNode) => void;
    updatePortal: (name: string, node: ReactNode) => void;
    removePortal: (name: string) => void;
};
export interface PortalProviderProps {
    shouldAddRootHost?: boolean;
    rootHostName?: string;
    children: ReactNode | ReactNode[];
}
export declare const PortalProvider: React.MemoExoticComponent<({ rootHostName, shouldAddRootHost, children, }: PortalProviderProps) => JSX.Element>;
export interface PortalHostProps {
    name: string;
}
export declare const PortalHost: React.MemoExoticComponent<({ name }: PortalHostProps) => JSX.Element>;
export interface PortalItemProps {
    name?: string;
    hostName?: string;
    handleOnMount?: (mount: () => void) => void;
    handleOnUnmount?: (unmount: () => void) => void;
    handleOnUpdate?: (update: () => void) => void;
    children?: ReactNode | ReactNode[];
}
export declare const PortalItem: React.MemoExoticComponent<({ name, hostName, handleOnMount, handleOnUnmount, handleOnUpdate, children, }: PortalItemProps) => null>;
//# sourceMappingURL=GorhomPortal.d.ts.map