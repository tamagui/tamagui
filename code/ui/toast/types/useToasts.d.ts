import * as React from 'react';
import type { HeightT } from './Toaster';
import type { ToastT } from './ToastState';
export interface UseToastsOptions {
    /**
     * Maximum number of toasts to keep in state
     * @default 10
     */
    limit?: number;
}
export interface UseToastsReturn {
    /** Current list of toasts */
    toasts: ToastT[];
    /** Heights of each toast for stacking calculations */
    heights: HeightT[];
    /** Set heights (used by ToastItem) */
    setHeights: React.Dispatch<React.SetStateAction<HeightT[]>>;
    /** Whether toasts are expanded (hover state) */
    expanded: boolean;
    /** Set expanded state */
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    /** Remove a toast from the list */
    removeToast: (toast: ToastT) => void;
}
/**
 * Hook to subscribe to toast state and manage toast list.
 * Use this for building custom toast UIs with full control.
 *
 * @example
 * ```tsx
 * function MyToaster() {
 *   const { toasts, heights, setHeights, expanded, setExpanded, removeToast } = useToasts()
 *
 *   return (
 *     <ToastViewport onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
 *       {toasts.map((toast, index) => (
 *         <ToastItem
 *           key={toast.id}
 *           toast={toast}
 *           index={index}
 *           expanded={expanded}
 *           removeToast={removeToast}
 *           heights={heights}
 *           setHeights={setHeights}
 *           // ... other props
 *         />
 *       ))}
 *     </ToastViewport>
 *   )
 * }
 * ```
 */
export declare function useToasts(options?: UseToastsOptions): UseToastsReturn;
//# sourceMappingURL=useToasts.d.ts.map