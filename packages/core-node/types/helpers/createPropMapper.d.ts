import { StaticConfig } from '../types';
export declare type ResolveVariableTypes = 'auto' | 'value' | 'variable' | 'both';
export declare const createPropMapper: (staticConfig: Partial<StaticConfig>) => (key: string, value: any, theme: any, props: any, returnVariablesAs?: ResolveVariableTypes, avoidDefaultProps?: boolean) => any;
//# sourceMappingURL=createPropMapper.d.ts.map