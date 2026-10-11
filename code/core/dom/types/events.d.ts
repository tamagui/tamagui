/**
* Event payloads for the Tamagui DOM contract.
*
* Only the cross-platform subset is typed. Where an event's shape genuinely
* differs between a browser event and a react native synthetic event, the
* handler takes `unknown` rather than promising a shape one platform cannot
* deliver — `payload: 'unknown'` in the event table. These are the payloads a
* native primitive can construct in full, so a handler written against them
* behaves the same on both platforms.
*
* Extra platform fields are not excluded: a handler receives a value, and
* TypeScript only seals object literals, so reading a web-only field off the
* event still needs a cast and still says so at the call site.
*/
export type DOMClickEvent = {
	readonly altKey: boolean;
	readonly button: number;
	readonly ctrlKey: boolean;
	readonly defaultPrevented: boolean;
	readonly getModifierState: (key: string) => boolean;
	readonly metaKey: boolean;
	readonly pageX: number;
	readonly pageY: number;
	/** @platform web — native has nothing to cancel, so this is a no-op there */
	readonly preventDefault: () => void;
	readonly shiftKey: boolean;
	/** @platform web — native has nothing to cancel, so this is a no-op there */
	readonly stopPropagation: () => void;
	readonly type: "click";
};
export type DOMKeyEvent = {
	readonly key: string;
	readonly type?: string;
};
export type DOMChangeEvent = {
	readonly target: {
		readonly value: string;
	};
	readonly type: "change";
};
export type DOMInputEvent = {
	readonly target: {
		readonly value: string;
	};
	readonly type: "input";
};
export type DOMImageLoadEvent = {
	readonly target: {
		readonly naturalHeight?: number;
		readonly naturalWidth?: number;
	};
	readonly type: "load";
};
export type DOMImageErrorEvent = {
	readonly type: "error";
};

//# sourceMappingURL=events.d.ts.map