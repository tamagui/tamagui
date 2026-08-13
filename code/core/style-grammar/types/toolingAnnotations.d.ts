import { type TokenCategory } from "./registry";
import { type DiagnoseStyleValueOptions } from "./toolingDiagnostics";
import { type ModifierKind } from "./valueTypes";
export type StyleValueAnnotationKind = "modifier" | "token" | "keyword" | "identifier";
export interface StyleValueAnnotation {
	kind: StyleValueAnnotationKind;
	/** character span within the authored value */
	start: number;
	end: number;
	text: string;
	/** the clause modifier chain owning this slot; empty for the base value */
	modifiers?: readonly string[];
	/** for kind `modifier` */
	modifierKind?: ModifierKind;
	/** for kind `token`: the category binding it to the target property */
	tokenCategory?: TokenCategory;
	/** the resolved target property, when the candidate or keyword targets it */
	property?: string;
	/** authored color opacity suffix percentage */
	opacity?: number;
}
/**
* Classifies every meaningful span in one authored value. Works on partially
* invalid values too: whatever the parser could segment gets annotated, so
* hover and colors keep working while the author types.
*/
export declare function annotateStyleValue(property: string, input: string, options: DiagnoseStyleValueOptions): readonly StyleValueAnnotation[];

//# sourceMappingURL=toolingAnnotations.d.ts.map