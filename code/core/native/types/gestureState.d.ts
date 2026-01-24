export interface GestureState {
	enabled: boolean;
	Gesture: any;
	GestureDetector: any;
	ScrollView: any;
}
export declare function isGestureHandlerEnabled(): boolean;
export declare function getGestureHandlerState(): GestureState;
export declare function setGestureHandlerState(updates: Partial<GestureState>): void;

//# sourceMappingURL=gestureState.d.ts.map