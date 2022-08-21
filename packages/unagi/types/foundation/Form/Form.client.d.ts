import React, { FormEvent } from 'react';
interface FormProps {
    action: string;
    method?: string;
    children?: Array<React.ReactNode>;
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
    encType?: string;
    noValidate?: boolean;
}
export declare function Form({ action, method, children, onSubmit, encType, noValidate, ...props }: FormProps): JSX.Element;
export {};
//# sourceMappingURL=Form.client.d.ts.map