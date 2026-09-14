/**
* Combine two flat values for the same property, later winning.
*
* The merge unit is the clause, so a later `borderColor="green"` overrides the
* earlier base without erasing an earlier `press:transparent`. Style values
* that carry no clause take the cheap path and the later one simply wins,
* which is every ordinary prop.
*/
export declare function mergeFlatValues(earlier: unknown, later: unknown): unknown;

//# sourceMappingURL=mergeFlatValues.d.ts.map