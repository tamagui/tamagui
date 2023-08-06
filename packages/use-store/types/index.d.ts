export * from './useStore';
export { configureUseStore } from './configureUseStore';
export * from './interfaces';
export * from './selector';
export * from './reaction';
export { UNWRAP_PROXY } from './constants';
export * from './comparators';
export * from './decorators';
export declare class Store<Props extends Record<string, any>> {
    props: Props;
    constructor(props: Props);
}
//# sourceMappingURL=index.d.ts.map