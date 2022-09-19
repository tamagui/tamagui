import React from 'react';
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    /** The destination URL that the link points to. This is the `href` attribute of the underlying `<a>` element. */
    to: string;
    /** Whether to update the state object or URL of the current history entry. Refer to the [history.replaceState documentation](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState). */
    replace?: boolean;
    /** The custom client state with the navigation. */
    clientState?: any;
    /** Whether to reload the whole document on navigation. */
    reloadDocument?: boolean;
    /** Whether to prefetch the link source when the user signals intent. Defaults to `true`. For more information, refer to [Prefetching a link source](https://shopify.dev/custom-storefronts/hydrogen/framework/routes#prefetching-a-link-source). */
    prefetch?: boolean;
    /** Whether to emulate natural browser behavior and restore scroll position on navigation. Defaults to `true`. */
    scroll?: boolean;
    /** Override the `basePath` inherited from the Route */
    basePath?: string;
}
/**
 * The `Link` component is used to navigate between routes. Because it renders an underlying `<a>` element, all
 * properties available to the `<a>` element are also available to the `Link` component.
 * For more information, refer to the [`<a>` element documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes).
 */
export declare const Link: React.ForwardRefExoticComponent<LinkProps & React.RefAttributes<HTMLAnchorElement>>;
/**
 * Credit: Remix's <Link> component.
 */
export declare function composeEventHandlers<EventType extends React.SyntheticEvent | Event>(theirHandler: ((event: EventType) => any) | undefined, ourHandler: (event: EventType) => any): (event: EventType) => any;
//# sourceMappingURL=Link.client.d.ts.map