import type { TextParentStyles } from './types';
/** moves text-only styles to their longhand keys and leaves every other prop alone */
export declare function splitTextProps<Props extends object>(props: Props): [Partial<TextParentStyles>, Omit<Props, keyof TextParentStyles>];
//# sourceMappingURL=splitTextProps.d.ts.map