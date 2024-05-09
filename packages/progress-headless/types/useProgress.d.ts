type ProgressState = 'indeterminate' | 'complete' | 'loading';
interface UseProgressParams {
    value: number;
    width: number;
    max?: number;
    getValueLabel?: (value: number, max: number) => string;
}
export declare function useProgress(params: UseProgressParams): {
    frame: {
        readonly 'aria-valuemax': number;
        readonly 'aria-valuemin': 0;
        readonly 'aria-valuenow': number | undefined;
        readonly 'aria-valuetext': string | undefined;
        readonly role: "progressbar";
        readonly 'data-state': ProgressState;
        readonly 'data-value': number | undefined;
        readonly 'data-max': number;
        readonly overflow: "hidden";
    };
    indicator: {
        x: number;
    };
};
export {};
//# sourceMappingURL=useProgress.d.ts.map