import { UnagiUseQueryOptions } from '../../useQuery/index.js';
import { ResponseSync } from '../ResponseSync.js';
/**
 * The `fetchSync` hook makes API requests and is the recommended way to make simple fetch calls on the server and the client.
 * It's designed similar to the [Web API's `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch), only in a way
 * that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html).
 */
export declare function fetchSync(url: string, options?: Omit<RequestInit, 'cache'> & UnagiUseQueryOptions): ResponseSync;
//# sourceMappingURL=fetchSync.d.ts.map