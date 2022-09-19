/**
 * Strip out script `src` values from <script> tags in a given HTML template.
 * Returns two lists of scripts, split based on whether they are `type="module"`.
 */
export declare function stripScriptsFromTemplate(template: string): {
    noScriptTemplate: string;
    bootstrapScripts: string[];
    bootstrapModules: string[];
};
//# sourceMappingURL=template.d.ts.map