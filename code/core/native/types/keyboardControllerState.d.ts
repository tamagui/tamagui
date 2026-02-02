export interface KeyboardControllerState {
	enabled: boolean;
	KeyboardProvider: any;
	KeyboardAwareScrollView: any;
	useKeyboardHandler: any;
	useReanimatedKeyboardAnimation: any;
	KeyboardController: any;
	KeyboardEvents: any;
	KeyboardStickyView: any;
}
export declare function isKeyboardControllerEnabled(): boolean;
export declare function getKeyboardControllerState(): KeyboardControllerState;
export declare function setKeyboardControllerState(updates: Partial<KeyboardControllerState>): void;

//# sourceMappingURL=keyboardControllerState.d.ts.map