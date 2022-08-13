import { ReactNode } from 'react';
import { ColorValue } from '../../types';
import { ViewProps } from '../View';
declare type RefreshControlProps = {
    colors?: Array<ColorValue>;
    enabled?: boolean;
    onRefresh?: () => void;
    progressBackgroundColor?: ColorValue;
    progressViewOffset?: number;
    refreshing: boolean;
    size?: 0 | 1;
    tintColor?: ColorValue;
    title?: string;
    titleColor?: ColorValue;
} & ViewProps;
declare function RefreshControl(props: RefreshControlProps): ReactNode;
export default RefreshControl;
//# sourceMappingURL=index.d.ts.map