import { MutableRefObject } from 'react';
declare type DisposeFn = () => void;
declare type IntersectFn = (props: IntersectionObserverEntry & {
    dispose?: DisposeFn | null;
}, didResize?: boolean) => void | DisposeFn;
export declare const useIsIntersecting: (ref: MutableRefObject<HTMLElement | null>, { once, ...opts }?: IntersectionObserverInit & {
    once?: boolean | undefined;
}) => boolean;
export declare const useOnIntersecting: (ref: MutableRefObject<HTMLElement | null>, incomingCb: IntersectFn, options?: IntersectionObserverInit, mountArgs?: any[]) => void;
export {};
//# sourceMappingURL=useOnIntersecting.d.ts.map