# v2 toggle and accordion integration review

## requested outcome

- review `v2-toggle-accordion-autoheight` against local `main`
- keep the toggle active-style precedence fix
- keep accordion height-to/from-auto animation shared across CSS and Reanimated drivers
- preserve smooth open and close behavior, including initially open accordions and content below the last item
- keep the native Detox coverage and its workflow registration
- integrate the reviewed commits into local `main` with linear history
- do not push, publish, or release

## acceptance checks

- affected packages build
- focused toggle and accordion web tests pass
- compiler transition tests pass for both normal CSS rendering and CSS-only static extraction
- native test/workflow wiring is internally consistent
- fresh review finds no unresolved correctness issue
