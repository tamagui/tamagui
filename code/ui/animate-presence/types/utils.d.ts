import { type ReactElement, type ReactNode } from 'react';
export type ComponentKey = string | number;
export declare const getChildKey: (child: ReactElement<any>) => ComponentKey;
export declare function onlyElements(children: ReactNode): ReactElement<any>[];
export declare function invariant(condition: any, log: string, ...logVars: string[]): void;
//# sourceMappingURL=utils.d.ts.map