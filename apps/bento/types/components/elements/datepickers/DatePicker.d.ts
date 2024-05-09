export declare function useDateAnimation({ listenTo }: {
    listenTo: 'year' | 'month' | 'years';
}): {
    prevNextAnimation: () => {
        enterStyle: {
            opacity: number;
            x?: undefined;
        };
        exitStyle?: undefined;
    } | {
        enterStyle: {
            opacity: number;
            x: number;
        };
        exitStyle: {
            opacity: number;
            x: number;
        };
    } | undefined;
    prevNextAnimationKey: string | number;
};
/** ------ EXAMPLE ------ */
export declare function DatePickerExample(): import("react/jsx-runtime").JSX.Element;
export declare namespace DatePickerExample {
    var fileName: string;
}
//# sourceMappingURL=DatePicker.d.ts.map