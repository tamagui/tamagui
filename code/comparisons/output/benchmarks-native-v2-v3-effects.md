# V2/V3 native benchmark derived effects

Derived from the frozen authoritative JSON (SHA-256 `78354c231a142de17149bb9a8e1b88c7a2d4e83728d59f3e7b63958624be2f5b`). Ratio of means is right/left. Paired difference is right minus left in milliseconds; each 95% CI uses 12 round-paired retained differences (Student t, df=11).

| Comparison            | Case          | Metric  | Ratio of means | Paired difference mean (ms) | Paired difference 95% CI (ms) |
| --------------------- | ------------- | ------- | -------------: | --------------------------: | ----------------------------: |
| runtime V3 versus V2  | simple        | mount   |       1.379050 |                    7.712497 |         4.058333 to 11.366661 |
| runtime V3 versus V2  | simple        | update  |       1.396105 |                    6.088305 |          4.982621 to 7.193990 |
| runtime V3 versus V2  | simple        | remount |       1.306172 |                    5.464611 |          4.424057 to 6.505165 |
| runtime V3 versus V2  | themed        | mount   |       1.420498 |                    7.884944 |          5.799025 to 9.970864 |
| runtime V3 versus V2  | themed        | update  |       1.217927 |                    3.594715 |          1.944046 to 5.245385 |
| runtime V3 versus V2  | themed        | remount |       1.248144 |                    4.339365 |          3.219851 to 5.458879 |
| runtime V3 versus V2  | rich          | mount   |       1.518186 |                   18.731319 |        12.217045 to 25.245594 |
| runtime V3 versus V2  | rich          | update  |       1.561630 |                   15.290656 |        14.198293 to 16.383020 |
| runtime V3 versus V2  | rich          | remount |       1.534285 |                   16.480045 |        15.410844 to 17.549246 |
| runtime V3 versus V2  | group         | mount   |       1.189295 |                   15.649181 |        13.445738 to 17.852623 |
| runtime V3 versus V2  | group         | update  |       1.342473 |                   12.039868 |         9.885414 to 14.194322 |
| runtime V3 versus V2  | group         | remount |       1.219961 |                   17.085816 |        14.020374 to 20.151258 |
| runtime V3 versus V2  | heavy         | mount   |       1.252903 |                   11.861813 |         7.871241 to 15.852384 |
| runtime V3 versus V2  | heavy         | update  |       1.285703 |                    6.885351 |          5.831535 to 7.939167 |
| runtime V3 versus V2  | heavy         | remount |       1.237611 |                    9.852778 |         8.618249 to 11.087306 |
| runtime V3 versus V2  | component     | mount   |       0.988061 |                   -0.600604 |         -4.428683 to 3.227475 |
| runtime V3 versus V2  | component     | update  |       1.327298 |                    7.725917 |          6.237181 to 9.214652 |
| runtime V3 versus V2  | component     | remount |       0.998610 |                   -0.063066 |         -1.521586 to 1.395454 |
| compiled V3 versus V2 | simple        | mount   |       5.161051 |                   19.297771 |        17.780355 to 20.815187 |
| compiled V3 versus V2 | simple        | update  |       1.021408 |                    0.015930 |         -0.162994 to 0.194855 |
| compiled V3 versus V2 | simple        | remount |       5.485683 |                   18.737024 |        18.216178 to 19.257870 |
| compiled V3 versus V2 | nested-static | mount   |       6.070733 |                   32.646313 |        30.248296 to 35.044330 |
| compiled V3 versus V2 | nested-static | update  |       1.051935 |                    0.019319 |         -0.083900 to 0.122539 |
| compiled V3 versus V2 | nested-static | remount |       5.919110 |                   28.370455 |        27.675895 to 29.065015 |
| compiled V3 versus V2 | styled-static | mount   |       1.500150 |                    4.300559 |          2.900458 to 5.700661 |
| compiled V3 versus V2 | styled-static | update  |       0.996618 |                   -0.001108 |         -0.038745 to 0.036530 |
| compiled V3 versus V2 | styled-static | remount |       1.496931 |                    3.645371 |          2.957804 to 4.332939 |
| V2 compiler effect    | simple        | mount   |       0.227932 |                  -15.709201 |      -17.601596 to -13.816807 |
| V2 compiler effect    | simple        | update  |       0.048413 |                  -14.626298 |      -15.551580 to -13.701017 |
| V2 compiler effect    | simple        | remount |       0.234034 |                  -13.671111 |      -14.727583 to -12.614638 |
| V3 compiler effect    | simple        | mount   |       0.853029 |                   -4.123927 |         -8.339819 to 0.091964 |
| V3 compiler effect    | simple        | update  |       0.035420 |                  -20.698674 |      -21.421941 to -19.975406 |
| V3 compiler effect    | simple        | remount |       0.982898 |                   -0.398698 |         -1.270372 to 0.472976 |

Positive paired differences mean the right-hand arm was slower for a lower-is-better duration. Confidence intervals describe this one controlled iOS Simulator campaign; they are not physical-device or population-wide guarantees.
