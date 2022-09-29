import { MutableRefObject } from 'react';
declare type DisposeFn = () => void;
declare type IntersectFn = (props: IntersectionObserverEntry & {
    dispose?: DisposeFn | null;
}, didResize?: boolean) => void | DisposeFn;
declare type HTMLRef = MutableRefObject<HTMLElement | null>;
export declare const useIsIntersecting: (refs: HTMLRef | HTMLRef[], { once, ...opts }?: IntersectionObserverInit & {
    once?: boolean | undefined;
}) => boolean;
export declare const useOnIntersecting: (refsIn: HTMLRef | HTMLRef[], incomingCb: IntersectFn, options?: IntersectionObserverInit, mountArgs?: any[]) => void;
export {};
//# sourceMappingURL=useOnIntersecting.d.ts.map