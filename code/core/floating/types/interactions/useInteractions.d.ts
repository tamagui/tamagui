import type { HTMLProps } from 'react';
import type { ElementProps } from './types';
export declare function useInteractions(propsList: Array<ElementProps | void>): {
    getReferenceProps(userProps?: HTMLProps<Element>): Record<string, any>;
    getFloatingProps(userProps?: HTMLProps<HTMLElement>): Record<string, any>;
    getItemProps(userProps?: HTMLProps<HTMLElement>): Record<string, any>;
};
//# sourceMappingURL=useInteractions.d.ts.map