declare type Listener = (e: any) => void;
declare type EventHandle = (target: EventTarget, callback: Listener | null) => () => void;
export declare type EventOptions = {
    capture?: boolean;
    passive?: boolean;
};
export default function createEventHandle(type: string, options?: EventOptions | null): EventHandle;
export {};
//# sourceMappingURL=index.d.ts.map