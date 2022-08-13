import { ComponentType, ReactNode } from 'react';
declare type AppParams = Object;
export declare type ComponentProvider = () => ComponentType<any>;
export declare type ComponentProviderInstrumentationHook = (component: ComponentProvider) => ComponentType<any>;
export declare type WrapperComponentProvider = (arg0: any) => ComponentType<unknown>;
export declare type AppConfig = {
    appKey: string;
    component?: ComponentProvider;
    run?: Function;
    section?: boolean;
};
export default class AppRegistry {
    static getAppKeys(): Array<string>;
    static getApplication(appKey: string, appParameters?: AppParams): {
        element: ReactNode;
        getStyleElement: (arg0: any) => ReactNode;
    };
    static registerComponent(appKey: string, componentProvider: ComponentProvider): string;
    static registerConfig(config: Array<AppConfig>): void;
    static registerRunnable(appKey: string, run: Function): string;
    static runApplication(appKey: string, appParameters: Record<string, any>): void;
    static setComponentProviderInstrumentationHook(hook: ComponentProviderInstrumentationHook): void;
    static setWrapperComponentProvider(provider: WrapperComponentProvider): void;
    static unmountApplicationComponentAtRootTag(rootTag: any): void;
}
export {};
//# sourceMappingURL=index.d.ts.map