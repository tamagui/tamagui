import { Logger } from '../../utilities/log/index.js';
import type { CookieOptions } from '../Cookie/Cookie.js';
import type { SessionStorageAdapter } from '../session/session-types.js';
/** The `FileSessionStorage` component persists session data to the file system.
 */
export declare const FileSessionStorage: (name: string, dir: string, cookieOptions: CookieOptions) => (log: Logger) => SessionStorageAdapter;
//# sourceMappingURL=FileSessionStorage.d.ts.map