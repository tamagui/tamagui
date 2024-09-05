import * as Walkthrough from '../../components/panels/walkthrough';
type Props = ReturnType<typeof walkthroughGetComponentCodes>;
export declare function walkthrough(props: Props): import("react/jsx-runtime").JSX.Element;
export declare function walkthroughGetComponentCodes(): {
    codes: Omit<Record<keyof typeof Walkthrough, string>, "getCode">;
};
export {};
//# sourceMappingURL=walkthrough.d.ts.map