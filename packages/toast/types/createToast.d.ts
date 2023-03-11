import { Scope } from '@tamagui/create-context';
import React from 'react';
import { CreateNativeToastsOptions } from './types';
type NativeValue = boolean | 'web' | 'mobile';
interface CreateToastOptions {
    native?: NativeValue;
}
interface ToastOptions extends CreateNativeToastsOptions {
    /**
     * Used when need custom data
     */
    additionalInfo?: Record<string, any>;
    native?: NativeValue;
}
type ScopedProps<P> = P & {
    __scopeToast?: Scope;
};
type ToastData = {
    title: string;
    id: string;
} & CreateNativeToastsOptions;
declare const createToast: (options?: CreateToastOptions) => {
    ImperativeToastProvider: ({ __scopeToast, children, }: ScopedProps<{
        children: React.ReactNode;
    }>) => JSX.Element;
    useToast: () => {
        /**
         * The toast to get and show if not using native
         */
        currentToast: ToastData | null;
        show(title: string, showOptions?: ToastOptions): void;
    };
};
export { createToast };
export type { CreateToastOptions };
//# sourceMappingURL=createToast.d.ts.map