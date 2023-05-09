import { TamaguiComponent } from '../types';
export declare const withStaticProperties: <A extends Function | TamaguiComponent, ExtraStaticProps>(component: A, staticProps: ExtraStaticProps) => A extends TamaguiComponent<infer A_1, infer B, infer C, infer D, infer E> ? TamaguiComponent<A_1, B, C, D, E & ExtraStaticProps> : A & ExtraStaticProps;
//# sourceMappingURL=withStaticProperties.d.ts.map