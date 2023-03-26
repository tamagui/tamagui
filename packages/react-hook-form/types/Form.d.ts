/// <reference types="react" />
import { FieldValues } from 'react-hook-form';
import { FormProps, StaticProps } from './types';
export declare function createForm<TValues extends FieldValues = FieldValues>(): ((params: FormProps<TValues>) => JSX.Element) & StaticProps<TValues>;
//# sourceMappingURL=Form.d.ts.map