/**
 * Credit to geist-ui/react, it's initially copied from there and updated.
 *
 * MIT License

Copyright (c) 2020 Geist UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
import React, { type ReactNode } from 'react';
type ReactChildArray = ReturnType<typeof React.Children.toArray>;
export declare function flattenChildrenKeyless(children: ReactNode): ReactChildArray;
export declare function flattenChildren(children: ReactNode, componentNamesToIgnore?: string[], depth?: number, keys?: (string | number)[]): ReactNode[];
export declare const pickChildren: <Props = any>(_children: ReactNode | undefined, targetChild: React.ElementType, componentNamesToIgnore?: string[]) => {
    targetChildren: React.ReactElement<Props, string | React.JSXElementConstructor<any>>[] | undefined;
    withoutTargetChildren: (string | number | bigint | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined>)[] | null | undefined;
};
export declare const isInstanceOfComponent: (element: React.ReactElement | ReactNode | undefined, targetElement: React.ElementType) => boolean;
export declare const filterNull: <T extends unknown | null | undefined>(t: T) => t is NonNullable<T>;
export declare const create: <Props extends {}>(Component: React.ComponentType<Props>, displayName: string) => React.FC<Props>;
export {};
//# sourceMappingURL=utils.d.ts.map