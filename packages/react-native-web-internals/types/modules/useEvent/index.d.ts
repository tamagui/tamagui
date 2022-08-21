declare type AddListener = (target: EventTarget, listener: null | ((arg0: any) => void)) => () => void;
export default function useEvent(event: string, options?: {
    capture?: boolean;
    passive?: boolean;
} | null): AddListener;
export {};
//# sourceMappingURL=index.d.ts.map