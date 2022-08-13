import * as React from 'react';
import type { LayoutEvent, LayoutValue } from '../../types';
import type { ViewProps } from '../View';
declare type KeyboardAvoidingViewProps = ViewProps & {
    behavior?: 'height' | 'padding' | 'position';
    contentContainerStyle?: ViewProps['style'];
    keyboardVerticalOffset: number;
};
declare class KeyboardAvoidingView extends React.Component<KeyboardAvoidingViewProps> {
    frame: LayoutValue | null;
    relativeKeyboardHeight(keyboardFrame: Record<string, any>): number;
    onKeyboardChange(event: Object): void;
    onLayout: (event: LayoutEvent) => void;
    render(): React.ReactNode;
}
export default KeyboardAvoidingView;
//# sourceMappingURL=index.d.ts.map