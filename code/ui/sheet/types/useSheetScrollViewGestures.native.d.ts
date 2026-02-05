import type { GestureResponderEvent, ScrollView as RNScrollView } from 'react-native';
import type { ScrollBridge } from './types';
interface UseSheetScrollViewGesturesProps {
    scrollRef: React.RefObject<RNScrollView | null>;
    scrollBridge: ScrollBridge;
    hasScrollableContent: boolean;
    scrollEnabled: boolean;
    setScrollEnabled: (enabled: boolean, lockTo?: number) => void;
}
/**
 * Native gesture handling for Sheet ScrollView.
 * Returns responder props for the ScrollView component.
 */
export declare function useSheetScrollViewGestures({ scrollBridge, hasScrollableContent, scrollEnabled, setScrollEnabled, }: UseSheetScrollViewGesturesProps): {
    onResponderRelease: () => void;
    onStartShouldSetResponder: () => boolean;
    onMoveShouldSetResponder: (e: GestureResponderEvent) => boolean;
    onResponderMove: (e: GestureResponderEvent) => void;
};
export {};
//# sourceMappingURL=useSheetScrollViewGestures.native.d.ts.map