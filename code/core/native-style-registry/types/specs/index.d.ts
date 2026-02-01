import type { TamaguiShadowRegistry as TamaguiShadowRegistrySpec } from './ShadowRegistry.nitro';
import type { ShadowNode, Unistyle } from '../types';
interface ShadowRegistry extends TamaguiShadowRegistrySpec {
    add(handle?: ViewHandle, styles?: Unistyle): void;
    remove(handle?: ViewHandle): void;
}
type ViewHandle = {
    __internalInstanceHandle?: {
        stateNode?: {
            node?: ShadowNode;
        };
    };
    getScrollResponder?: () => {
        getNativeScrollRef?: () => ViewHandle;
    };
    getNativeScrollRef?: () => ViewHandle;
    _viewRef?: ViewHandle;
    viewRef?: {
        current?: ViewHandle;
    };
    _nativeRef?: ViewHandle;
};
declare let HybridShadowRegistry: ShadowRegistry | null;
export { HybridShadowRegistry as TamaguiShadowRegistry };
//# sourceMappingURL=index.d.ts.map