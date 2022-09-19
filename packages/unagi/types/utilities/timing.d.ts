/**
 * Not all environments have access to Performance.now(). This is to prevent
 * timing side channel attacks.
 *
 * See: https://community.cloudflare.com/t/cloudflare-workers-how-do-i-measure-execution-time-of-my-method/69672
 */
export declare function getTime(): number;
//# sourceMappingURL=timing.d.ts.map