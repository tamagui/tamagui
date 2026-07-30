import type { ModifierRegistryView, ParsedClause } from "./valueTypes";
export declare const unitlessNumberProperties: ReadonlySet<string>;
export interface ConvertLegacyConditionOptions {
	registry: ModifierRegistryView;
}
export interface LegacyConditionContribution {
	prop: string;
	clause: ParsedClause;
}
export interface LegacyConditionError {
	code: string;
	path: string;
	message: string;
}
export interface LegacyConditionResult {
	contributions: LegacyConditionContribution[];
	errors: LegacyConditionError[];
}
export declare function convertLegacyConditionProp(propName: string, value: unknown, options: ConvertLegacyConditionOptions): LegacyConditionResult | null;

//# sourceMappingURL=legacyConditions.d.ts.map