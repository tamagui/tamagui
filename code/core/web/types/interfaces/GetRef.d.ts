import type { Component, JSXElementConstructor, Ref } from 'react';
import type { TamaguiComponent } from '../types';
export type GetRef<C> = C extends TamaguiComponent<any, infer Ref> ? Ref : C extends new (props: any) => Component ? InstanceType<C> : C extends abstract new (...args: any) => any ? InstanceType<C> : C extends Component ? C : (C extends JSXElementConstructor<{
    ref?: infer R;
}> ? R : C extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[C]['ref'] : unknown) extends Ref<infer T> | string | undefined ? T : unknown;
//# sourceMappingURL=GetRef.d.ts.map