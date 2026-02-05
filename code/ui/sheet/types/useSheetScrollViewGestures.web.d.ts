import type { ScrollView as RNScrollView } from 'react-native';
import type { ScrollBridge } from './types';
interface UseSheetScrollViewGesturesProps {
    scrollRef: React.RefObject<RNScrollView | null>;
    scrollBridge: ScrollBridge;
    hasScrollableContent: boolean;
}
/**
 * Web-specific touch gesture handling for Sheet ScrollView.
 * Uses direct DOM touch events for reliable gesture handling.
 * The React Responder system loses events once browser scroll takes over.
 */
export declare function useSheetScrollViewGestures({ scrollRef, scrollBridge, hasScrollableContent, }: UseSheetScrollViewGesturesProps): void;
export {};
//# sourceMappingURL=useSheetScrollViewGestures.web.d.ts.map