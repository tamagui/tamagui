import React from 'react';
export declare type ToastOptions = {
    duration?: number;
    type?: 'info' | 'success' | 'error';
};
export declare const Toast: {
    clear: () => void;
    show: (content: any, options?: ToastOptions | undefined) => void;
    error: (content: any, options?: Omit<ToastOptions, "type"> | undefined) => void;
    success: (content: any, options?: Omit<ToastOptions, "type"> | undefined) => void;
};
export declare const ToastRoot: React.NamedExoticComponent<object>;
//# sourceMappingURL=Toast.d.ts.map