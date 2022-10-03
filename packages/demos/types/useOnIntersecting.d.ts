import { MutableRefObject } from 'react';
declare type DisposeFn = () => void;
declare type IntersectCallback = (props: (IntersectionObserverEntry | null)[], didResize?: boolean) => DisposeFn | void | null;
declare type Options = IntersectionObserverInit & {
    ignoreResize?: boolean;
};
declare type HTMLRef = MutableRefObject<HTMLElement | null>;
export declare function useIsIntersecting<Ref extends HTMLRef | HTMLRef[]>(refs: Ref, { once, ...opts }?: Options & {
    once?: boolean;
}): Ref extends any[] ? boolean[] : boolean;
export declare function useOnIntersecting<Ref extends HTMLRef | HTMLRef[]>(refsIn: Ref, incomingCbRaw: IntersectCallback, { threshold, ignoreResize, root, rootMargin }?: Options, mountArgs?: any[]): void;
export {};
//# sourceMappingURL=useOnIntersecting.d.ts.map