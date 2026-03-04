import type { Delay, ElementProps, FloatingInteractionContext, UseHoverProps } from './types';
export declare function getDelay(value: Delay | undefined, prop: 'open' | 'close', pointerType?: string): number | undefined;
export interface UseHoverReturn extends ElementProps {
}
export declare function useHover(context: FloatingInteractionContext, props?: UseHoverProps): ElementProps;
//# sourceMappingURL=useHover.d.ts.map