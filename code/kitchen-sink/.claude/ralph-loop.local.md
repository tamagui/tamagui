---
active: true
iteration: 6
max_iterations: 50
completion_promise: null
started_at: "2026-01-24T10:17:21Z"
---


please keep at this until youre 100% confident:

- read plans/native-gestures.md
- read docs/using-ios.md

use detox fast path

don't forget you have great references in:

- ~/github/react-native-actions-sheet
- ~/github/react-native-bottom-sheet

BOTH are good references

some ntoes:

- make sure change directions works, snapping, fundamentals
- make sure it does a nice top thing where it sheet slows down apst the top and then releases back to place when you let go there!
- would be cool if it bounced a bit past on scroll when down at the bottom
- same for if you reach end of list still having overscroll would be cool (not required if taking a while)
- the big test is handoff - going up down to move between scroll/drag multople times without issue

RUN an /alert when you hit this step so I can review but keep going

once 100% on detox record a video and while using MCP
analyze frames ensure no jumping! ensure tests did what they said! sometimes it can be glitchy on intial drag and jump down or something.

once 100% confident with both, ensure ALL checks and tests pass using:

RUN an /alert when you hit this step so I can review but keep going

yarn release --canary --ci --dry-run --build-fast

once that truly all passes do a MASSIVE review using sub-agents notes:

- WE DONT WANT rngh at all on web
- WE CANT rely on reanimated, works for native animation driver too
- ONLY if they plug in rngh should it work
- No import of rngh directly in sheet
- Clean typed implementation with minimal code dup, minimal awkward back and forth, no circular improts, should just have a clean separate file in Sheet ideally
- Ideally we move the setup/native deps to @tamagui/native-gestures/setup instead of sheet
- And then we can have a tamagui/setup-native-gestures too like we did w/portal

RUN an /alert when you hit this step so I can review but keep going

after you clean up all code and refactor and tests pass again:

- push to v2-native-gestures PR ensure it passes in CI with /monitor
- while doing that write docs! really good ones! and version-two blog post!
- test WEB! try just using Chrome MCP or playwright to visit web sheets make sure they work nicely even with css driver or motion driver (kitchen sink web is good), note web dont use rngh follow other path
- when done with ALL of this and CI fully green /alert me
- update rngh-sheet with final ntoes and move this ralph loop into the bottom of it as a note for future claude coding sessions including your review of what worked well / didnt work during the session

done with all that?

lets merge this in:

https://github.com/tamagui/tamagui/pull/3838

so we can greatly speed up native tests in general and rmeove you hardcoded test on ktichen ink home in favor of this instaed, make sure it all passes

