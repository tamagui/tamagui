import { type LoweredModulePlan, type LoweredModuleStats } from "@tamagui/compiler-core";
import type { CompiledMetroModule, MetroBabelTransformArgs } from "./babel";
export interface MetroCompilerLoweringResult {
	applied: boolean;
	diagnostics: LoweredModulePlan["diagnostics"];
	sourceMapComposed: boolean;
	stats: LoweredModuleStats;
}
/** Applies the cacheable E3 plan and returns a Babel AST mapped to the original module. */
export declare function applyMetroCompilerPlan(compiled: CompiledMetroModule, plan: LoweredModulePlan, args: MetroBabelTransformArgs, transformerPath: string): {
	ast: Record<string, any>;
	lowering: MetroCompilerLoweringResult;
};

//# sourceMappingURL=lowering.d.ts.map