import type { ParsedValue } from "./valueTypes";
export declare const namedCssColors: ReadonlySet<string>;
export declare function splitTopLevelComponents(value: string): string[];
export declare function classifyComponent(component: string, colorTokens: ReadonlySet<string>): "color" | "image" | null;
export declare function splitBackgroundValue(value: ParsedValue, colorTokens: ReadonlySet<string>): {
	entries: Array<{
		property: "backgroundColor" | "backgroundImage";
		value: ParsedValue;
	}>;
	errors: Array<{
		code: "unsupported-bg-component";
		component: string;
		where: "base" | number;
	}>;
};

//# sourceMappingURL=backgroundFamily.d.ts.map