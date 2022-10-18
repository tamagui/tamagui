import { MutableRefObject } from 'react';
declare type DisposeFn = () => void;
declare type IntersectCallback = (props: (IntersectionObserverEntry | null)[], didResize?: boolean) => DisposeFn | void | null;
declare type HTMLRef = MutableRefObject<HTMLElement | null>;
export declare function useIsIntersecting<Ref extends HTMLRef | HTMLRef[]>(refs: Ref, { once, ...opts }?: IntersectionObserverInit & {
    once?: boolean;
}): Ref extends any[] ? boolean[] : boolean;
export declare function useOnIntersecting<Ref extends HTMLRef | HTMLRef[]>(refsIn: Ref, incomingCbRaw: IntersectCallback, { threshold, root, rootMargin }?: IntersectionObserverInit, mountArgs?: any[]): void;
export {};
//# sourceMappingURL=useOnIntersecting.d.ts.map