/**
 *

Copyright (c) 2015 Gil Barbara

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
interface Options {
    authorizedInInputs: number[];
    disableKeys: boolean;
    disableScroll: boolean;
    disableWheel: boolean;
    keyboardKeys: number[];
    outsideOf?: HTMLElement;
}
declare class DisableScroll {
    element: Element | null;
    lockToScrollPos: [number, number];
    options: Options;
    constructor();
    /**
     * Disable Page Scroll
     */
    on(options?: Partial<Options>): void;
    /**
     * Re-enable page scrolls
     */
    off(): void;
    handleWheel: (e: WheelEvent | TouchEvent) => void;
    handleScroll: () => void;
    handleKeydown: (e: KeyboardEvent) => void;
}
export declare const disableScroll: DisableScroll;
export {};
//# sourceMappingURL=disableScroll.d.ts.map