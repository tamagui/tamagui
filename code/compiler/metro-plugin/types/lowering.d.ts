import { type LoweredModulePlan, type LoweredModuleStats } from "@tamagui/compiler-core";
import { type CompiledMetroModule, type MetroBabelTransformArgs } from "./babel";
export interface MetroCompilerLoweringResult {
	applied: boolean;
	diagnostics: LoweredModulePlan["diagnostics"];
	sourceMapComposed: boolean;
	stats: LoweredModuleStats;
}
/**
* Applies the cacheable E3 plan to the raw module source, then runs the user's
* Babel transformer once over the lowered source. Plans carry spans into raw
* source, so this process's Babel output never needs to match the planning
* process's byte for byte — Babel options can differ freely between them.
*/
export declare function applyMetroCompilerPlan(args: MetroBabelTransformArgs, plan: LoweredModulePlan, transformerPath: string): Promise<{
	compiled: CompiledMetroModule;
	lowering: MetroCompilerLoweringResult;
}>;

//# sourceMappingURL=lowering.d.ts.map