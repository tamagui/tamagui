/**
 * Returns the specificity bump for a platform media key so that more specific
 * platform selectors reliably override more general ones regardless of the order
 * props are declared.
 *
 * Cascade (low → high importance):
 *   $platform-native / $platform-web         → bump 0  (widest)
 *   $platform-android / $platform-ios        → bump 1  (OS-specific)
 *   $platform-tv                             → bump 2  (TV subset of Android/iOS)
 *   $platform-androidtv / $platform-tvos     → bump 3  (most specific)
 *
 * @param mediaKeyShort - Platform media key without the leading '$' (e.g. 'platform-tv', 'platform-androidtv')
 */
export declare function getPlatformSpecificityBump(mediaKeyShort: string): number;
export declare function isActivePlatform(key: string): boolean;
//# sourceMappingURL=isActivePlatform.d.ts.map