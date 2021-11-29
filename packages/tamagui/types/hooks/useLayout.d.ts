/// <reference types="react" />
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';
export declare const useLayout: (props?: {
    stateless?: boolean | undefined;
    onLayout?: ((rect: LayoutChangeEvent) => void) | undefined;
}) => {
    layout: LayoutRectangle | null;
    onLayout: ((rect: LayoutChangeEvent) => void) | undefined;
    ref?: undefined;
} | {
    layout: LayoutRectangle | null;
    ref: import("react").MutableRefObject<any>;
    onLayout?: undefined;
};
//# sourceMappingURL=useLayout.d.ts.map