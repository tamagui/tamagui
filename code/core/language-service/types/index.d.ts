import type ts from "typescript";
export interface TamaguiLanguageServicePluginConfig {
	/** Path to the config JSON emitted by the Tamagui compiler. */
	configPath?: string;
}
declare const init: ts.server.PluginModuleFactory;
export default init;

//# sourceMappingURL=index.d.ts.map