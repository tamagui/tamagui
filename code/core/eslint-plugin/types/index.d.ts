import type { Rule } from "eslint";
export declare const validFlatValues: Rule.RuleModule;
export interface TamaguiEslintRules {
	"valid-flat-values": Rule.RuleModule;
}
export interface TamaguiEslintPlugin {
	meta: {
		name: string;
	};
	rules: TamaguiEslintRules;
}
export declare const rules: TamaguiEslintRules;
declare const plugin: TamaguiEslintPlugin;
export default plugin;

//# sourceMappingURL=index.d.ts.map