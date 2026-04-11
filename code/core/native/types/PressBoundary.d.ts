import React from "react";
import { View, type ViewProps } from "react-native";
export interface PressBoundaryProps extends ViewProps {
	enabled?: boolean;
	/**
	* Alias for enabling the boundary. The behavior is limited to Tamagui's
	* shared press ownership and does not patch arbitrary RN bubbling.
	*/
	stopPropagation?: boolean;
	debugName?: string | null;
}
export declare const PressBoundary: React.ForwardRefExoticComponent<PressBoundaryProps & React.RefAttributes<View>>;

//# sourceMappingURL=PressBoundary.d.ts.map