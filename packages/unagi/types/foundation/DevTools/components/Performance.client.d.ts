interface Navigation {
    url: string;
    type: string;
    ttfb: number;
    fcp: number;
    lcp: number;
    duration: number;
    size: number;
}
interface Props {
    navigations: Navigation[];
}
export declare function Performance({ navigations }: Props): JSX.Element;
export {};
//# sourceMappingURL=Performance.client.d.ts.map