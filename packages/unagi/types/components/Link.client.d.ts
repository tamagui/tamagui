import React from 'react';
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    to: string;
    replace?: boolean;
    clientState?: any;
    reloadDocument?: boolean;
    prefetch?: boolean;
    scroll?: boolean;
    basePath?: string;
}
export declare const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
export declare function composeEventHandlers<EventType extends React.SyntheticEvent | Event>(theirHandler: ((event: EventType) => any) | undefined, ourHandler: (event: EventType) => any): (event: EventType) => any;
//# sourceMappingURL=Link.client.d.ts.map