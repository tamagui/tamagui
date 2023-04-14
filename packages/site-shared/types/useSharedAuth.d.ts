import { Session, SupabaseClient } from '@supabase/auth-helpers-react';
/**
 * used to share auth between tamagui.dev and other apps
 */
export declare const useSharedAuth: (supabase: SupabaseClient, opts?: {
    onAuthenticated?: ((session: Session) => void) | undefined;
    onUnauthenticated?: (() => void) | undefined;
    onError?: (() => void) | undefined;
} | undefined) => void;
//# sourceMappingURL=useSharedAuth.d.ts.map