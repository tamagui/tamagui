import React from 'react';
import type { GetProps } from 'tamagui';
type PreProps = Omit<GetProps<typeof Pre>, 'css'>;
export type CodeBlockProps = PreProps & {
    language: 'tsx';
    value: string;
    line?: string;
    css?: any;
    mode?: 'static';
    showLineNumbers?: boolean;
};
declare const _default: React.ForwardRefExoticComponent<Omit<CodeBlockProps, "ref"> & React.RefAttributes<HTMLPreElement>>;
export default _default;
declare const Pre: any;
//# sourceMappingURL=CodeBlock.d.ts.map