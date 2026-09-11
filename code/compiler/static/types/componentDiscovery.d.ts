import type { MaterializedModule } from '@tamagui/compiler-core';
import type { CompilerComponentRegistry } from './compilerHost';
/**
 * Evaluate a host-resolved module and return its exports, or null when the
 * host cannot run it. Frontends supply this from their bundler's module runner
 * (Vite) or the static-evaluation require hooks (`evaluateComponentModule`).
 */
export type ComponentModuleEvaluator = (module: {
    id: string;
    specifier: string;
}) => Promise<Record<string, unknown> | null>;
/**
 * Finds the component modules a file uses that the configured `components`
 * list does not cover, evaluates each once, and registers what it exports so
 * lowering resolves them like configured ones. Owned by a frontend for the
 * life of a project generation; `prepare` runs between materialize and lower.
 */
export declare class ComponentDiscovery {
    #private;
    clear(): void;
    /** host-resolved ids of every module discovery found components in */
    ids(): string[];
    /** re-register everything found so far into a freshly built registry */
    seed(registry: CompilerComponentRegistry): void;
    prepare(module: MaterializedModule, registry: CompilerComponentRegistry, evaluate: ComponentModuleEvaluator | undefined): Promise<void>;
}
//# sourceMappingURL=componentDiscovery.d.ts.map