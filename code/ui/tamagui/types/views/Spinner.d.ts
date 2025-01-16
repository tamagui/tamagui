import type { ColorTokens, ThemeTokens } from '@tamagui/core';
import type { YStackProps } from '@tamagui/stacks';
<<<<<<< HEAD
import type * as React from 'react';
=======
import * as React from 'react';
>>>>>>> master
export type SpinnerProps = Omit<YStackProps, 'children'> & {
    size?: 'small' | 'large';
    color?: (ColorTokens | ThemeTokens | (string & {})) | null;
};
export declare const Spinner: React.ForwardRefExoticComponent<SpinnerProps & React.RefAttributes<any>>;
//# sourceMappingURL=Spinner.d.ts.map