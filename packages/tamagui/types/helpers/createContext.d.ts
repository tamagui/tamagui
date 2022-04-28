import * as React from 'react';
declare function createContext<ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType): readonly [{
    (props: ContextValueType & {
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string) => ContextValueType];
declare type Scope<C = any> = {
    [scopeName: string]: React.Context<C>[];
} | undefined;
declare type ScopeHook = (scope: Scope) => {
    [__scopeProp: string]: Scope;
};
interface CreateScope {
    scopeName: string;
    (): ScopeHook;
}
declare function createContextScope(scopeName: string, createContextScopeDeps?: CreateScope[]): readonly [<ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType | undefined) => readonly [{
    (props: ContextValueType & {
        scope: Scope<ContextValueType>;
        children: React.ReactNode;
    }): JSX.Element;
    displayName: string;
}, (consumerName: string, scope: Scope<ContextValueType | undefined>) => ContextValueType], CreateScope];
export { createContext, createContextScope };
export type { CreateScope, Scope };
//# sourceMappingURL=createContext.d.ts.map