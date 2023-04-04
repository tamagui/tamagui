import { SupabaseClient } from '@supabase/auth-helpers-react';
/**
 * used to share auth between tamagui.dev and other apps
 */
export declare const useSharedAuth: (supabase: SupabaseClient, opts?: {
    onAuthenticated?: () => void;
    onUnauthenticated?: () => void;
}) => void;
//# sourceMappingURL=useSharedAuth.d.ts.map