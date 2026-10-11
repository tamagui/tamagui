import type { ComponentType } from 'react';
/**
 * `html.*` on native without the compiler.
 *
 * The compiler is still the fast path: it resolves the tag, the element
 * defaults, the prop mapping and the literal-text wrapping at build time and
 * emits the primitive directly. When it did not run, the generated
 * `html.native.tsx` renders the same primitive through a regular Tamagui
 * component instead, and this module does the two things the primitives
 * deliberately do not do: mapping DOM props to their react native spelling, and
 * wrapping a raw string child of a view-backed tag in a text primitive.
 *
 * The result has to be what the compiler would have produced for the same
 * source, so every rule here is the runtime twin of one in `nativeDOMProps` in
 * `compilerHost.ts`, and the tables it reads are generated from the same
 * `@tamagui/dom` tables the compiler reads.
 *
 * Nothing here is reachable from a non-`.native` module, so the web bundle
 * never loads it.
 */
/** the table-derived mapping, generated into `html.native.tsx` */
export type DOMPropTables = {
    /** dom prop name to its react native spelling, when the two differ */
    renamed: Readonly<Record<string, string>>;
    /** dom prop name to the nested accessibility object and key it becomes */
    nested: Readonly<Record<string, readonly [string, string]>>;
    /** props the tables declare have no native equivalent, with their note */
    unsupportedProps: Readonly<Record<string, string>>;
    /** events the tables declare have no native equivalent */
    unsupportedEvents: ReadonlySet<string>;
    /** the `data-*` row's note, for any data prop other than data-testid */
    dataPropNote: string;
    /** input types react native can render with a text-entry control */
    nativeInputTypes: ReadonlySet<string>;
    /** what an authored `display: flex` means on native */
    flexDefaults: Readonly<Record<string, string | number>>;
};
export type DOMTagSpec = {
    /** text and textinput backings resolve inherited text styles */
    inherits?: boolean;
    /** a view backing cannot render a raw string, so literal children are wrapped */
    wrapsLiteralText?: boolean;
    /** implicit aria role from the tag table */
    role?: string;
    /** text-entry tag, which changes disabled, type and multiline handling */
    entry?: 'input' | 'textarea';
};
/**
 * Builds the `html.*` members from one shared set of generated tables, so a tag
 * costs a frame, a spec object and nothing else.
 */
export declare function createDOMTagFactory(tables: DOMPropTables): <Frame extends ComponentType<any>>(tag: string, Component: Frame, spec?: DOMTagSpec) => Frame;
/**
 * A tag the tag table marks `native: 'none'`. The compiler reports it as a
 * build error; reaching one here means the compiler did not run, and rendering
 * an approximation of a control native does not have is what the DOM contract
 * exists to prevent.
 */
export declare function unsupportedDOMTag(tag: string, note: string): {
    (): never;
    displayName?: string;
};
//# sourceMappingURL=htmlRuntime.native.d.ts.map