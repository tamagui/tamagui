/// <reference types="react" />
export interface PresenceContextProps {
    id: string;
    isPresent: boolean;
    register: (id: string) => () => void;
    onExitComplete?: (id: string) => void;
    initial?: false | string | string[];
    custom?: any;
    exitVariant?: string | null;
    enterVariant?: string | null;
}
export declare const PresenceContext: import("react").Context<PresenceContextProps | null>;
//# sourceMappingURL=PresenceContext.d.ts.map