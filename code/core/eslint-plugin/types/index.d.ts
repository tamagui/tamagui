export { validFlatValues } from "./validFlatValues";
import type { Rule } from "eslint";
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