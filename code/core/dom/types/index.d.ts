/**
* `@tamagui/dom` — the Tamagui DOM contract.
*
* The tables here are the single source of truth for DOM mode: the compiler
* reads them to classify tags, validate props and nesting and inject native
* primitives, the runtime reads them for element defaults and native prop
* mapping, and the prop-interface generator reads them to emit the strict
* types. React Strict DOM is the semantic reference and conformance oracle
* (see `compatibility.ts`), never a dependency.
*/
export * from "./tables/attributes";
export * from "./tables/compatibility";
export * from "./tables/events";
export * from "./tables/nativeBacking";
export * from "./tables/tags";
export * from "./tables/types";

//# sourceMappingURL=index.d.ts.map