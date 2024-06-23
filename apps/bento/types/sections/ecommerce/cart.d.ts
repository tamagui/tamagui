import * as Cart from '../../components/ecommerce/cart';
type Props = ReturnType<typeof cartGetComponentCodes>;
export declare function cart(props: Props): import("react/jsx-runtime").JSX.Element;
export declare function cartGetComponentCodes(): {
    codes: Omit<Record<keyof typeof Cart, string>, "getCode">;
};
export {};
//# sourceMappingURL=cart.d.ts.map