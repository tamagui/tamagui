export declare type HoverEventsConfig = {
    contain?: boolean | null;
    disabled?: boolean | null;
    onHoverStart?: ((e: any) => void) | null;
    onHoverChange?: ((bool: boolean) => void) | null;
    onHoverUpdate?: ((e: any) => void) | null;
    onHoverEnd?: ((e: any) => void) | null;
};
export default function useHover(targetRef: any, config: HoverEventsConfig): void;
//# sourceMappingURL=index.d.ts.map