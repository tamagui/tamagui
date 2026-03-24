import type { Middleware } from '@floating-ui/react-dom';
export interface InnerProps {
    listRef: React.RefObject<Array<HTMLElement | null>>;
    index: number | null;
    offset?: number;
    overflowRef: React.RefObject<any>;
    onFallbackChange?: null | ((fallback: boolean) => void);
    padding?: number;
    minItemsVisible?: number;
    referenceOverflowThreshold?: number;
    scrollRef?: React.RefObject<HTMLElement | null>;
}
export declare const inner: (props: InnerProps) => Middleware;
//# sourceMappingURL=inner.d.ts.map