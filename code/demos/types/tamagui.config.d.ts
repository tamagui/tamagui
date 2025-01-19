import { config } from '@tamagui/config/v3';
export { config } from '@tamagui/config/v3';
export default config;
export type Conf = typeof config;
declare module 'tamagui' {
    interface TamaguiCustomConfig extends Conf {
    }
}
//# sourceMappingURL=tamagui.config.d.ts.map