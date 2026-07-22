import type { ReactNode } from 'react';
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
export type ActionTypes = AddUpdatePortalAction | RemovePortalAction | RegisterHostAction | UnregisterHostAction;
export declare const usePortal: (hostName?: string) => {
    registerHost: () => void;
    deregisterHost: () => void;
    addPortal: (name: string, node: ReactNode) => void;
    updatePortal: (name: string, node: ReactNode) => void;
    removePortal: (name: string) => void;
};
export interface PortalProviderProps {
    /**
     * Defines whether to add a default root host or not.
     *
     * @default true
     * @type boolean
     */
    shouldAddRootHost?: boolean;
    /**
     * Defines the root portal host name.
     *
     * @default "root"
     * @type string
     */
    rootHostName?: string;
    children: ReactNode | ReactNode[];
}
declare const PortalProviderComponent: ({ rootHostName, shouldAddRootHost, children, }: PortalProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const PortalProvider: React.MemoExoticComponent<typeof PortalProviderComponent>;
export interface PortalHostProps {
    /**
     * Host's key or name to be used as an identifier.
     * @type string
     */
    name: string;
    forwardProps?: Record<string, any>;
    /**
     * Useful when trying to animate children with AnimatePresence.
     *
     * Not a part of gorhom/react-native-portal
     */
    render?: (children: React.ReactNode) => React.ReactElement;
}
export declare const PortalHost: React.MemoExoticComponent<(props: PortalHostProps) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=GorhomPortal.d.ts.map