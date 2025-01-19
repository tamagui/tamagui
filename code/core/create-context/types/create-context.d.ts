import * as React from 'react';
export type ScopedProps<P, K extends string> = P & {
    [Key in `__scope${K}`]?: Scope;
};
export declare function createContext<ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType): readonly [{
    (props: ContextValueType & {
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, (consumerName: string) => Exclude<ContextValueType | undefined, undefined>];
type ScopeHook = (scope: Scope) => {
    [__scopeProp: string]: Scope;
};
export type Scope<C = any> = {
    [scopeName: string]: React.Context<C>[];
} | undefined;
export interface CreateScope {
    scopeName: string;
    (): ScopeHook;
}
export declare function createContextScope(scopeName: string, createContextScopeDeps?: CreateScope[]): readonly [<ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType) => readonly [{
    (props: ContextValueType & {
        scope: Scope<ContextValueType>;
        children: React.ReactNode;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
}, (consumerName: string, scope: Scope<ContextValueType | undefined>, options?: {
    warn?: boolean;
    fallback?: Partial<ContextValueType>;
}) => ContextValueType], CreateScope];
export {};
//# sourceMappingURL=create-context.d.ts.map