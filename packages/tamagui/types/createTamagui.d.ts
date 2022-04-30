import { CreateTamaguiConfig, CreateTamaguiProps, TamaguiInternalConfig } from '@tamagui/core';
export declare function createTamagui<Conf extends CreateTamaguiProps>(config: Conf): Conf extends Partial<CreateTamaguiConfig<infer A, infer B, infer C, infer D, infer E>> ? TamaguiInternalConfig<A, B, C, D, E> : unknown;
//# sourceMappingURL=createTamagui.d.ts.map