import React from 'react';
import { PopoverArrow } from './PopoverArrow';
import { PopoverContent } from './PopoverContent';
import type { IPopoverProps } from './types';
interface PopoverI extends React.FunctionComponent<IPopoverProps> {
    Arrow: typeof PopoverArrow;
    Content: typeof PopoverContent;
}
export declare const Popover: PopoverI;
export {};
//# sourceMappingURL=Popover.d.ts.map