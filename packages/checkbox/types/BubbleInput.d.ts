/// <reference types="react" />
import { CheckedState } from './helpers';
type InputProps = any;
interface BubbleInputProps extends Omit<InputProps, 'checked'> {
    checked: CheckedState;
    bubbles: boolean;
}
export declare const BubbleInput: (props: BubbleInputProps) => JSX.Element;
export {};
//# sourceMappingURL=BubbleInput.d.ts.map