---
active: true
iteration: 11
max_iterations: 30
completion_promise: null
started_at: "2026-01-24T00:50:00Z"
---

ayo so we bailed from a recent sheet change / investigation not sure if i stored the
  findings
  eomwhere in this repo, a commented out test, or md or gh pr, ro soething gl, idk try adn find

  MAKE A plans/rngh-sheet.md re-read it each loop, update it and edit it

  basically our Sheet drag behavior is imposisble to gt right on ios becuase inherently you nede the press events to
  come
  earlier.

  gorhom botom sheet and react native actions sheet both fix this by using react-native-gesture-handler but this is
  a
  native dep and tamagui doesnt assume that

  BUT we recently landed teleport using a setup pattern and docs

  - study teleport / portal stuff
  - create a new v2-native-gestures branch off v2
  - make a plan and save it as plans/native-gestures.md
  - re-review your plan if youre hearing this prompt again and update/find improvements to do
  - TDD style implement a feature:

  basically we want IF they have set up rngh, Sheet is smarter and fixes our issues:

  - Sheet + Sheet.ScrollView has major bugs we did a deep detox test case i believe that hopefully is somewhere
  where it
  shows. it just doesnt hand off smoothly and prevent properly. on ios only we can test for now but basically it
  should:

  - when at top let you naturally scroll on swipe up
  - sipe down and it bounces back at top
  - if you are down and drag down it should scroll to the top THEN SEAMLESSLY hadn off to dragging down
  - likewise if you then drag back to top and hit sheet top it should SEAMLESSLY continue scrolling naturally

  this shold be basically perfect like native sheet!

  also opt in! so onyl if they opted in do we change behvatio to assume a RNGH and use their promitives
  hopefiulyl can do it cleanyl and well sparated
  
  WHEN DONE commit and push and monitor ci for passing

  BTW your tests often dont capture scroll psoition or actual really good logic you amy need to extensivel screenshot things to really confirm you are testing right
  
   /ralph-wiggum:ralph-loop ayo so we bailed from a recent sheet change / investigation not sure if i stored the findings
  eomwhere in this repo, a commented out test, or md or gh pr, ro soething gl, idk try adn find

  basically our Sheet drag behavior is imposisble to gt right on ios becuase inherently you nede the press events to come
  earlier.

  gorhom botom sheet and react native actions sheet both fix this by using react-native-gesture-handler but this is a
  native dep and tamagui doesnt assume that

  BUT we recently landed teleport using a setup pattern and docs

  - study teleport / portal stuff
  - create a new v2-native-gestures branch off v2
  - make a plan and save it as plans/native-gestures.md
  - re-review your plan if youre hearing this prompt again and update/find improvements to do
  - TDD style implement a feature:

  basically we want IF they have set up rngh, Sheet is smarter and fixes our issues:

  - Sheet + Sheet.ScrollView has major bugs we did a deep detox test case i believe that hopefully is somewhere where it
  shows. it just doesnt hand off smoothly and prevent properly. on ios only we can test for now but basically it should:

  - when at top let you naturally scroll on swipe up
  - sipe down and it bounces back at top
  - if you are down and drag down it should scroll to the top THEN SEAMLESSLY hadn off to dragging down
  - likewise if you then drag back to top and hit sheet top it should SEAMLESSLY continue scrolling naturally

  this shold be basically perfect like native sheet!

  also opt in! so onyl if they opted in do we change behvatio to assume a RNGH and use their promitives
  hopefiulyl can do it cleanyl and well sparated
