# V2/V3 native benchmark derived effects

Derived from the partially valid authoritative JSON (SHA-256 `71aa4f53960f9b2620bd394b6634213bd6d8d988069549977174ee8da4b4f0ac`). Ratio of means is right/left. Paired difference is right minus left in milliseconds; each 95% CI uses 30 round-paired retained differences (Student t, df=29).

All rows involving `tamagui-v3-compiled` are marked INVALID. Its Release
bundle missed every cached Metro lowering plan because workers supplied
project-relative filenames while the cache was keyed by absolute realpaths.
Re-measure after `2acce54e05` lands. Runtime V3 versus V2 and the V2 compiler
effect remain valid.

| Comparison | Case | Metric | Ratio of means | Paired difference mean (ms) | Paired difference 95% CI (ms) |
| --- | --- | --- | ---: | ---: | ---: |
| runtime V3 versus V2 | simple | mount | 1.146229 | 3.506386 | 2.360878 to 4.651894 |
| runtime V3 versus V2 | simple | update | 1.120297 | 2.566790 | 1.459356 to 3.674225 |
| runtime V3 versus V2 | simple | remount | 1.126897 | 3.032479 | 2.121946 to 3.943012 |
| runtime V3 versus V2 | themed | mount | 1.080543 | 1.957713 | 0.768600 to 3.146825 |
| runtime V3 versus V2 | themed | update | 1.019483 | 0.428939 | -0.363608 to 1.221486 |
| runtime V3 versus V2 | themed | remount | 1.060310 | 1.462672 | 0.647400 to 2.277944 |
| runtime V3 versus V2 | rich | mount | 1.266199 | 11.471199 | 9.707134 to 13.235263 |
| runtime V3 versus V2 | rich | update | 1.285061 | 10.202697 | 8.991239 to 11.414155 |
| runtime V3 versus V2 | rich | remount | 1.266108 | 11.239154 | 10.012356 to 12.465952 |
| runtime V3 versus V2 | group | mount | 1.024704 | 2.711204 | 0.393294 to 5.029114 |
| runtime V3 versus V2 | group | update | 1.115186 | 5.704476 | 4.213232 to 7.195721 |
| runtime V3 versus V2 | group | remount | 1.027702 | 3.108989 | -0.242022 to 6.460000 |
| runtime V3 versus V2 | heavy | mount | 1.004759 | 0.285968 | -1.463991 to 2.035927 |
| runtime V3 versus V2 | heavy | update | 1.057307 | 1.878997 | 0.922286 to 2.835709 |
| runtime V3 versus V2 | heavy | remount | 1.007241 | 0.437269 | -1.300783 to 2.175322 |
| runtime V3 versus V2 | component | mount | 0.807537 | -12.567312 | -15.139274 to -9.995351 |
| runtime V3 versus V2 | component | update | 1.044324 | 1.455265 | 0.575265 to 2.335266 |
| runtime V3 versus V2 | component | remount | 0.808405 | -12.325356 | -13.783041 to -10.867671 |
| compiled V3 versus V2 (INVALID) | simple | mount | 5.094674 | 21.256422 | 20.516279 to 21.996565 |
| compiled V3 versus V2 (INVALID) | simple | update | 0.971911 | -0.029131 | -0.063276 to 0.005014 |
| compiled V3 versus V2 (INVALID) | simple | remount | 5.282232 | 21.057233 | 20.538869 to 21.575598 |
| compiled V3 versus V2 (INVALID) | nested-static | mount | 4.767966 | 31.504446 | 30.733924 to 32.274968 |
| compiled V3 versus V2 (INVALID) | nested-static | update | 0.901985 | -0.053101 | -0.076763 to -0.029440 |
| compiled V3 versus V2 (INVALID) | nested-static | remount | 5.016079 | 32.154076 | 31.442661 to 32.865492 |
| compiled V3 versus V2 (INVALID) | styled-static | mount | 1.381442 | 3.585007 | 2.991574 to 4.178440 |
| compiled V3 versus V2 (INVALID) | styled-static | update | 0.944911 | -0.026324 | -0.046727 to -0.005920 |
| compiled V3 versus V2 (INVALID) | styled-static | remount | 1.276183 | 2.662071 | 2.239658 to 3.084483 |
| V2 compiler effect | simple | mount | 0.216493 | -18.787524 | -19.582319 to -17.992728 |
| V2 compiler effect | simple | update | 0.048604 | -20.300046 | -21.097114 to -19.502977 |
| V2 compiler effect | simple | remount | 0.205771 | -18.979896 | -19.681131 to -18.278661 |
| V3 compiler effect (INVALID) | simple | mount | 0.962253 | -1.037488 | -2.219461 to 0.144486 |
| V3 compiler effect (INVALID) | simple | update | 0.042166 | -22.895967 | -23.699004 to -22.092930 |
| V3 compiler effect (INVALID) | simple | remount | 0.964532 | -0.955142 | -1.706993 to -0.203290 |

Positive paired differences mean the right-hand arm was slower for a lower-is-better duration. INVALID rows are retained only as a forensic record. Confidence intervals describe this one controlled iOS Simulator campaign; they are not physical-device or population-wide guarantees.
