import type { CookieOptions } from '../Cookie/Cookie.js';
import type { SessionStorageAdapter } from '../session/session-types.js';
/** The `MemorySessionStorage` component stores session data within Hydrogen runtime memory.
 */
export declare const MemorySessionStorage: (name: string, options: CookieOptions) => () => SessionStorageAdapter;
//# sourceMappingURL=MemorySessionStorage.d.ts.map