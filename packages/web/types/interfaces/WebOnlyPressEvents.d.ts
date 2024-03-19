import type { PressableProps } from 'react-native';
import type { DivAttributes } from '../types';
export interface WebOnlyPressEvents {
    onPress?: PressableProps['onPress'];
    onLongPress?: PressableProps['onLongPress'];
    onPressIn?: PressableProps['onPress'];
    onPressOut?: PressableProps['onPress'];
    onHoverIn?: DivAttributes['onMouseEnter'];
    onHoverOut?: DivAttributes['onMouseLeave'];
    onMouseEnter?: DivAttributes['onMouseEnter'];
    onMouseLeave?: DivAttributes['onMouseLeave'];
    onMouseDown?: DivAttributes['onMouseDown'];
    onMouseUp?: DivAttributes['onMouseUp'];
    onFocus?: DivAttributes['onFocus'];
    onBlur?: DivAttributes['onBlur'];
}
//# sourceMappingURL=WebOnlyPressEvents.d.ts.map