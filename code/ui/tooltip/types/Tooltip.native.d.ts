declare const RenderChildren: (props: any) => any;
declare const RenderNull: (props: any) => null;
export declare const TooltipGroup: () => null;
export declare const closeOpenTooltips: () => void;
export declare const Tooltip: typeof RenderChildren & {
    Anchor: typeof RenderChildren;
    Arrow: typeof RenderNull;
    Close: typeof RenderNull;
    Content: typeof RenderNull;
    Trigger: typeof RenderChildren;
};
export {};
//# sourceMappingURL=Tooltip.native.d.ts.map