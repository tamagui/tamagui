import { ComponentType, FunctionComponent, ReactNode } from 'react';
export default function renderApplication<Props extends Object>(RootComponent: ComponentType<Props>, WrapperComponent: FunctionComponent<any> | null | undefined, callback: (() => void) | undefined, options: {
    hydrate: boolean;
    initialProps: Props;
    rootTag: any;
}): void;
export declare function getApplication(RootComponent: ComponentType<Object>, initialProps: Object, WrapperComponent?: FunctionComponent<any> | null): {
    element: ReactNode;
    getStyleElement: (object: Object) => ReactNode;
};
//# sourceMappingURL=renderApplication.d.ts.map