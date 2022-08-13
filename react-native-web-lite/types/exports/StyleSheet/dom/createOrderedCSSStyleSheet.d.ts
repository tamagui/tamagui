export declare type OrderedCSSStyleSheet = {
    getTextContent: () => string;
    insert: (cssText: string, groupValue: number) => void;
};
export default function createOrderedCSSStyleSheet(sheet: CSSStyleSheet | null): OrderedCSSStyleSheet;
//# sourceMappingURL=createOrderedCSSStyleSheet.d.ts.map