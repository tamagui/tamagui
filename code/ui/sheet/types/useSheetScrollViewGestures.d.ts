import type { ScrollViewRef } from '@tamagui/scroll-view';
import type { ScrollBridge } from './types';
interface UseSheetScrollViewGesturesProps {
    scrollRef: React.RefObject<ScrollViewRef | null>;
    scrollBridge: ScrollBridge;
    hasScrollableContent: boolean;
    scrollEnabled: boolean;
    setScrollEnabled: (enabled: boolean, lockTo?: number) => void;
    onManualScroll?: (node: HTMLElement, y: number) => void;
}
export declare function useSheetScrollViewGestures({ scrollRef, scrollBridge, hasScrollableContent, onManualScroll, }: UseSheetScrollViewGesturesProps): {};
export {};
//# sourceMappingURL=useSheetScrollViewGestures.d.ts.map