import type { ReactNode } from 'react';
export interface PortalItemProps {
    passthrough?: boolean;
    /**
     * Portal's key or name to be used as an identifier.
     * @type string
     * @default generated unique key.
     */
    name?: string;
    /**
     * Host's name to teleport the portal content to.
     * @type string
     * @default 'root'
     */
    hostName?: string;
    /**
     * Override internal mounting functionality, this is useful
     * if you want to trigger any action before mounting the portal content.
     * @type (mount?: () => void) => void
     * @default undefined
     */
    handleOnMount?: (mount: () => void) => void;
    /**
     * Override internal un-mounting functionality, this is useful
     * if you want to trigger any action before un-mounting the portal content.
     * @type (unmount?: () => void) => void
     * @default undefined
     */
    handleOnUnmount?: (unmount: () => void) => void;
    /**
     * Override internal updating functionality, this is useful
     * if you want to trigger any action before updating the portal content.
     * @type (update?: () => void) => void
     * @default undefined
     */
    handleOnUpdate?: (update: () => void) => void;
    /**
     * Portal's content.
     * @type ReactNode
     * @default undefined
     */
    children?: ReactNode | ReactNode[];
}
//# sourceMappingURL=types.d.ts.map