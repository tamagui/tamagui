import { CreateTamaguiConfig, CreateTamaguiProps, TamaguiInternalConfig } from '@tamagui/core';
export declare function createTamagui<Conf extends CreateTamaguiProps>(config: Conf): Conf extends Partial<CreateTamaguiConfig<infer A, infer B, infer C, infer D, infer E, infer F>> ? TamaguiInternalConfig<A, B, C, D, E, F> : unknown;
//# sourceMappingURL=createTamagui.d.ts.map