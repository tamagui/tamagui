import * as React from 'react';
declare type PossibleRef<T> = React.Ref<T> | undefined;
declare function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void;
declare function useComposedRefs<T>(...refs: PossibleRef<T>[]): (node: T) => void;
export { composeRefs, useComposedRefs };
//# sourceMappingURL=composeRefs.d.ts.map