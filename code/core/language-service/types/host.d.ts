import type { HostView } from "@tamagui/style-grammar/tooling";
import type ts from "typescript";
/**
* resolves the style-prop surface TypeScript assigns to a Tamagui component.
* the staticConfig marker distinguishes Tamagui hosts from unrelated React
* components, while the call signatures retain styled component prop types.
*/
export declare function resolveTamaguiHost(checker: ts.TypeChecker, component: ts.Node): HostView | undefined;

//# sourceMappingURL=host.d.ts.map