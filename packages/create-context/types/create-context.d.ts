import * as React from 'react';
export declare type ScopedProps<P, K extends string> = P & {
    [Key in `__scope${K}`]?: Scope;
};
export declare function createContext<ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType): readonly [{
    (props: ContextValueType & {
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string) => ContextValueType];
declare type ScopeHook = (scope: Scope) => {
    [__scopeProp: string]: Scope;
};
export declare type Scope<C = any> = {
    [scopeName: string]: React.Context<C>[];
} | undefined;
export interface CreateScope {
    scopeName: string;
    (): ScopeHook;
}
export declare function createContextScope(scopeName: string, createContextScopeDeps?: CreateScope[]): readonly [<ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType | undefined) => readonly [{
    (props: ContextValueType & {
        scope: Scope<ContextValueType>;
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string, scope: Scope<ContextValueType | undefined>) => ContextValueType], CreateScope];
export {};
//# sourceMappingURL=create-context.d.ts.map