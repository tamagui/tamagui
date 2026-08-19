# Item 29: lexer faithfulness, then retiring the bespoke injection predicate

> **STATUS UPDATE 2026-08-19.** Two things below are now out of date; see
> handoff-log section 40 for the evidence.
>
> 1. **The "retire the bespoke injection predicate" half is DONE.** The owner
>    chose to DROP the guard outright (`991d23eab4`), so
>    `carriesTopLevelInjection.ts` and `styleInjection.web.test.tsx` no longer
>    exist. Everything in this document about relocating, keeping or feeding the
>    guard is moot. What remains is lexer faithfulness, on correctness grounds
>    alone.
> 2. **The "emitted CSS" column below was measured WITH the guard present and is
>    now wrong.** `red /* hover:x */ blue` no longer "emits nothing": both halves
>    of the mis-parse now emit, and the base rule ends in an unterminated `/*`
>    that swallows following CSS. The defect got worse, not better.
>
> Also under-scoped: the 0-verdict-change blast radius against
> `tests/vectors.json` holds only because the Rust `tamagui-grammar` crate has no
> comment handling and the vectors contain no comment cases. A TypeScript-only
> fix would silently fork TS from Rust. Real scope is `scanFlatValue`,
> `tamagui-grammar/src/value.rs`, and new comment vectors, as one change.

Design proposal. Owner sign-off required before any code, same gate as item 28.
No source was changed to write this: every measurement below comes from a
scratchpad copy of the lexer, the repo's own corpora, and headless Chromium.

## Verdict

Do it, and do it as one change.

The blast radius is small and it is measured rather than estimated. Running a
prototype against everything this repo already pins:

| corpus | inputs | verdicts that change |
| --- | --- | --- |
| Rust conformance vectors (`tests/vectors.json`) | 645 | **0** |
| generated agreement corpus, both suite seeds | 800 | **0** |
| `valueParser.test.ts`'s url/string/escape cases | 15 | **0** |
| every string literal in `styleInjection.web.test.tsx` | 124 | **2** |
| every string literal in `parserAgreement.web.test.tsx` | 54 | **1** (the same value) |

Three pinned expectations flip, all three named below with the browser receipt
for which direction is correct. Parse cost moves between -3% and +8%, worst on
url-bearing values, against a budget that item 12 set at "do not repeat the
2-3x regression".

Two things found while designing this change the argument for doing it now
rather than eventually:

1. **A sixth bypass class is live today**, in the same family as the other five,
   and the design closes it as a side effect.
2. **A legitimate value is silently dropped today**, and the design fixes it.

Both are below with evidence.

## What is actually wrong

### The five bypasses were all one disagreement

`carriesTopLevelInjection` and CSS's tokenizer disagreed about which construct
the scan was inside: fake paren/quote depth, comment delimiters, an unterminated
string that CSS ends at a newline, an unquoted `url(` that recognises neither
strings nor comments, and a backslash outside a string. Two of those were
constructs the tokenizer never ENTERS, which is why enumerating cannot close the
class.

The predicate has since been taught all five. It is now a small, careful CSS
tokenizer living in `code/core/web/src/helpers/carriesTopLevelInjection.ts`,
about 150 lines including its own `opensUrlToken`. That is the problem: it is
the SECOND tokenizer, and `scanFlatValue` is the first, and they disagree.

### The two implementations disagree in both directions, today

READ, `bun` over both implementations, and confirmed end to end through
`simplifiedGetSplitStyles`:

| value | `scanFlatValue` | the guard | emitted CSS |
| --- | --- | --- | --- |
| `red /* ; } { */ blue` | refuses (3 x invalid-character) | accepts | emits, because no colon means the scanner never runs |
| `red /* hover:x */ blue` | base `red /*` + clause `hover` payload `x */ blue` | refuses both halves | **emits nothing** |
| `red hover:blue /* a:b */` | splits into two bogus clauses | refuses | **emits nothing** |
| `red/*` | accepts | refuses | dropped, correctly |
| `"abc\n;}.injected{opacity 0"` | accepts | refuses | dropped, correctly |

The second and third rows are the live defect on the accept side. A CSS comment
containing a colon is ordinary CSS, and today whether it survives depends on
whether the value contains a colon ANYWHERE, because that decides which of the
two implementations gets to answer. READ, from a probe run through the real
`getSplitStyles` on this tree:

```
A "red /* ; } { */ blue"   -> ["._bi-1125965761{background-image:red /* ; } { */ blue}"]
B "red /* hover:x */ blue" -> []
```

### The sixth class: containment failure is dangerous on its own

The guard's first test is a fast reject: a value carrying none of `;`, `{`, `}`,
`/*`, `*/` returns false immediately, however its delimiters sit. That is why
`styleInjection.web.test.tsx:226-231` PINS `url(a` and `url(a) extra)` as values
that must still emit.

`url(a` is not safe. READ, headless Chromium, emitting the value the way
`createAtomicRules` does and joining it with a sentinel rule the way
`createDesignSystem` joins `getAllRules()` with `\n`:

```
._probe{background-image:url(a;}
._sentinel{color:rgb(1, 2, 3);}

  rules parsed     : 1
  sentinel survives: false
  cssText          : ["._probe { }"]
```

The sentinel rule is gone. Same result for `"abc`, `'abc` and
`linear-gradient(135deg, red`: the unterminated construct swallows the `}` that
should close the block, and every following rule in the blob is consumed as
declarations inside it until some later `}` closes it.

Severity, stated plainly and not inflated: this is style DELETION, the same
class as the comment bypass, not rule injection. It cannot add a selector or a
declaration. It matters for the same reason that one did: deleting a rule is not
harmless when the rule is the one doing the hiding.

Scope, READ: this reaches the SSR blob and any consumer of
`getAllRules().join(separator)`. The client path inserts one rule at a time
through `sheet.insertRule` inside a try/catch (`insertStyleRule.tsx:389-391`), so
a malformed rule cannot reach its neighbours there.

INFERRED, and it stays INFERRED: nobody has driven a real SSR page with a
user-controlled `url(` value and watched a component lose its styling. It follows
from the CSSOM output above plus the join, and the fix does not depend on
proving it.

### `scanFlatValue` is not yet the safe foundation

The audit plan's probe table reproduces exactly. `red/*` and
`"abc\n;}.injected{opacity 0"` are ACCEPTED by the lexer today, and
`red /* ; } { */ blue` is over-refused. Hanging the guard on the lexer as it
stands would fix one class and reintroduce two closed ones. That is the whole
reason this item exists.

## The design

### 1. Three states in `scanFlatValue`

- **comment.** `/*` opens it at ANY depth, since `calc(1px /* pad */ + 2px)` is
  real CSS. It runs to `*/` however many lines that takes and holds no escapes:
  `\*/` still closes it. A comment is opaque content belonging to whatever
  segment it sits in, so a colon inside one is not a clause boundary and a `;`
  inside one is not a refused character. The visitor never sees it as anything
  but part of a base or a payload, which keeps the "index ranges, never slices"
  rule intact: there is nothing to strip and nothing to allocate.
- **string terminated by a newline.** CSS ends an unterminated string at a line
  feed, carriage return or form feed, as a parse error rather than a close. The
  scan reports `unterminated-string` at the opening quote and RESUMES at the
  newline, so a `;}` after it is seen where the browser sees it, at top level. A
  backslash before the newline is a line continuation and stays inside the
  string, so the escape branch is checked first.
- **url token.** `url(` followed by no quote is the one function CSS does not
  tokenize the contents of: no strings, no comments, only an escape and the `)`
  that ends it (including bad-url-to-`)`). `url("...")` is an ordinary function
  whose string is real, so the quote lookahead has to tell the two apart.
  `opensUrlToken` moves out of the guard and into the lexer, deleting the second
  copy.

Plus one refusal that is not a state: a `*/` with nothing open, at any depth,
because in a joined blob it closes a comment somewhere else.

Two new error codes, `unterminated-comment` and `stray-comment-close`. An
unclosed `url(` reports `unterminated-function` at its `(`, which is exactly what
it reports today, so `url(a`'s diagnostic does not move.

### 2. The guard consumes it

`carriesTopLevelInjection` keeps its module and its two call sites (`emitValue`
and `getStyleObject`) and shrinks to a fast reject plus one lexer call with a
hoisted visitor. Its state machine, its `opensUrlToken` and its comment ranking
comments all go.

The fast reject has to widen, and this is the part that closes the sixth class:

```
/["'()\;{}]|\/\*|\*\//
```

Any character that can OPEN a construct the emitted CSS has to close, plus the
three that end a declaration or a rule outright. A value with none of them
(`red`, `4px`, `1px solid red`) cannot fail the scan, so it exits on the regex
exactly as fast as today.

Dropping the reject entirely also works and is simpler, but it costs more than it
buys: measured below, `red` goes 10.3 -> 16.9 ns and a gradient 15.4 -> 123.1 ns,
for values that provably cannot fail.

### 3. Not proposed

- A real CSS tokenizer. This needs construct boundaries, not tokens. No numbers,
  idents, at-keywords, unicode ranges, or CDO/CDC.
- Making `parseValue`'s verdict a safety gate. After this change the lexer's
  failure set does cover the guard's refusal set, but "never gate emission on a
  parser result" is a good invariant and one call in `emitValue` is not
  expensive. The standing warning in `valueParser.ts` gets rewritten rather than
  deleted.
- Touching the modifier resolution half of any scanner. D7 is untouched.

## What changes for each caller

`scanFlatValue` has more consumers than the four in the brief. All of them:

**1. `parseValue`.** Accepts three shapes it refuses today (`red /* ; } { */
blue`, `url(a"b)`, `url(a'b)`), refuses four it accepts today (`red/*`, `red*/`,
a newline inside a string, and any value whose comment never closes), and splits
comment-bearing values differently (one base instead of a bogus clause). Two new
error codes flow into `ValueParseErrorCode` in `valueTypes.ts:74-86`,
`scanErrorMessage` in `valueParser.ts:85-93`, and `parseErrorSpan` in
`toolingDiagnostics.ts:253` (`unterminated-comment` joins the branch that
extends the squiggle to end-of-value).

**2. `contributeStyleString`.** Its colonless fast path and its clause path stop
disagreeing, which is what fixes rows B and C of the table above. Its refusal
message ternary at `directStyle.ts:1560-1567` needs the two new codes.

**3. `resolveVariants`.** Same split change. A variant value carrying a comment
with a colon stops producing a bogus clause.

**4. `hasFlatModifier`.** `1 /* enter:0 */ 2` stops putting the component on the
enter path, which is D4's shape with a comment instead of a `;`.

**5. The guard.** Covered above. This is a new consumer, and it is the point.

**6. The Rust port, `code/lsp/crates/tamagui-grammar/src/value.rs`.** A
line-for-line port of the same loop, checked by `cargo test --workspace` in
`checks.yaml` against generated vectors.

Measured, and it is the most useful number here: **0 of the 645 existing vectors
change.** So the vectors do not force the port. That is a trap, not a reprieve:
the vectors carry no `/*` or `*/` at all (READ, 0 of 645), so an unported Rust
parser would silently fork again, which is exactly how it forked the first time.
The port and new hand-written vectors land in the same change.

**7. `compilerHost.ts`.** A value that stops parsing falls back to runtime
instead of being extracted; a value that starts parsing gets extracted. Both are
correctness improvements in the same direction as the runtime.

**8. `codemod-flat-values`, `to-tailwind`, `mergeFlatValues`, `variables.ts`.**
All consume `parseValue` and inherit its verdict. `mergeFlatValues` reprints from
`base + clauses`, so a comment-bearing value stops round-tripping through a
bogus clause split.

### D6, and this is the decision the sign-off is really about

D6 is the divergence where `parseValue` reads `safe\;tail` as one payload with an
escaped semicolon and the guard refuses it. Once the guard consumes the lexer,
D6 cannot survive as it stands: one implementation cannot hold two answers.

**Measured: escaped delimiters are the ONLY thing that changes.** Comparing the
current predicate against "widened reject plus lexer failure" over every literal
in both suites, plus every historical bypass payload, the disagreement is exactly
`\;`, `\{` and `\}` at top level. Every one of the five bypasses, every
containment case, and `a\<newline>;}` all match.

**READ, headless Chromium: the escapes are contained, and refusing them is
over-refusal of valid CSS.**

```
._probe{font-family:my\;font;}     -> ._probe { font-family: "my;font"; }   sentinel survives
._probe{font-family:my\}font;}     -> ._probe { font-family: "my}font"; }   sentinel survives
._probe{animation-name:my\;anim;}  -> ._probe { animation-name: my\;anim; } sentinel survives
._probe{grid-area:my\{area;}       -> ._probe { grid-area: my\{area; }      sentinel survives
```

The escape is content. The declaration is intact, the family really is named
`my;font`, and the following rule lives. So the reasoning recorded for keeping
D6 ("CSS only honours `\;` as an escape inside an ident or a string") turns out
to argue the other way: a top-level `\;` STARTS an ident, and custom-idents are
exactly where an author would hit this.

**Recommendation: D6 disappears and the guard accepts escaped delimiters.** It
is one implementation, it matches CSS, and the campaign's own rule from the
`url(a/*b.png)` fix applies unchanged: over-refusal is not the safe direction, it
is a different bug.

**The alternative, if the owner would rather keep the strict posture:** teach
the LEXER to refuse a top-level escaped `;{}` instead. That also leaves one
implementation; the agreement just goes the other way, and `parseValue` becomes
stricter than CSS. It costs one branch, flips the `safe\;tail` hand-written Rust
vector from ok to error, and changes what `valueCorpus.ts`'s
`escapes: 'delimiter-free'` option means. I do not recommend it, but it is a
legitimate choice and it is the owner's, because it trades a rare valid value
against a posture.

D7 is untouched. It is about `hasFlatModifier` having no modifier registry, which
this change does not go near.

### Every pinned expectation that flips

Exhaustive, by running both implementations over every string literal in both
files rather than by reading them:

1. **`styleInjection.web.test.tsx:226-231`**, "a value with balanced delimiters
   and no payload characters is untouched". `url(a` must now be REFUSED, with the
   CSSOM output above in the test's comment. The other half of that test,
   `url(a) extra)`, keeps emitting and stays as the permissive control (its url
   token closes and its stray `)` is word content).
2. **`styleInjection.web.test.tsx:401-406`**, "an escape does not make a refused
   character safe". `safe\;tail` now emits. The test inverts and keeps its
   reasoning, with the `font-family` receipt.
3. **`parserAgreement.web.test.tsx:280-300`**, the D6 block. It moves out of
   `divergences` and into `agreement`: the canonical parser and the guard now
   give the same answer.

Both D6 literals are written `'safe\\;tail'`, so they carry a real backslash and
DO exercise the case. Checked, because this suite has already shipped one test
that could not fail.

Nothing else in either file moves. The 800-case generated corpus does not move,
so the four-way agreement tests pass untouched.

### Tests to add

- The four unterminated-construct values that carry none of the fast-reject
  characters (`"abc`, `'abc`, `url(a`, `linear-gradient(135deg, red`), refused,
  with the sentinel-rule receipt.
- `red /* hover:x */ blue` and `red hover:blue /* a:b */` emitting with the
  comment intact and no clause split, through BOTH the colonless and the clause
  path, since making those two agree is half the point.
- `url(a"b)` accepted (bad-url ends at `)`), next to the existing
  `url(a"b);}.injected{opacity 0")` refusal.
- Rust vectors for every one of the above.
- `valueCorpus.ts`'s `escapes` option flipped from `'delimiter-free'` to `true`
  in the agreement corpora, so the new agreement on escaped delimiters is fuzzed
  rather than asserted once. Its doc comment at `:183-191` cites D6 as the reason
  for the restriction, so the reason goes when D6 does.

## Performance

### The budget

Item 12's fight was a 2-3x regression, fixed by hoisting closures and inlining
the error branch. The budget for this item:

- **no regression on `parse: plain`**, the value shape that dominates
- **at most +10% on any `bench/parse-cost.mjs` input**
- **no change to the guard's cost for a value carrying no construct character**,
  which is what the widened fast reject buys

Measured against the bench in the same session on the same machine, three runs,
never against a number recorded on another day. The historical `113 -> 95 ns/op`
figure does not reproduce here at all (this machine reports `parse: plain` at
42-45 ns/op today), which is exactly why the comparison has to be within a
session.

### What it actually costs

`parseValue`, current lexer vs prototype, three runs:

| input | now ns/op | new ns/op | delta |
| --- | --- | --- | --- |
| plain | 42.0-43.1 | 40.7-42.7 | -4.4% to +0.3% |
| twoClause | 319-325 | 327-331 | +2.4% to +2.7% |
| gradient | 143-149 | 149-152 | +2.6% to +4.9% |
| sixClause | 765-783 | 796-810 | +1.7% to +4.1% |
| background (`url(x.png) surface hover:surface-hover`) | 220-224 | 235-242 | +7.1% to +7.9% |

The lexer alone moves -0.7% to +13.2%, and the whole-parse numbers are what
matter because the lexer is 35-40% of parse cost.

The url-bearing input is the worst case, and the cause is `opensUrlToken` running
at every `(`. That is the price of url fidelity and there is no version of this
item without it.

The guard, per value, at its two call sites:

| value | now | widened reject + lexer | no reject at all |
| --- | --- | --- | --- |
| `red` | 10.3 | 9.3 | 16.9 |
| `4px` | 10.5 | 10.8 | 19.0 |
| `1px solid red` | 15.4 | 14.5 | 42.4 |
| `rgba(0, 0, 0, 0.5)` | 12.1 | 55.7 | 47.2 |
| `url(x.png)` | 14.8 | 45.9 | 33.9 |
| `linear-gradient(...)` | 14.0 | 132.4 | 123.3 |

Construct-free values keep today's cost. A paren-bearing value goes from ~13 ns
to 46-132 ns, which is the price of checking containment on the values that can
actually fail containment. For scale, `parseValue` on that gradient is ~145 ns
and the surrounding `getSplitStyles` work is far more.

### If it went over budget

The honest answer first: **I tried the obvious micro-optimizations and they made
it worse.** Folding the two comment-delimiter tests into one `(code | 5) === 47`
filter and gating `opensUrlToken` behind an inline `l` check moved `gradient`
from +3.3% to +16.3% across two runs, reproducibly. The straightforward version
is the fast one. Whatever the cause in JSC, the lesson is to measure each lever
rather than reason about branch counts.

Levers I would try, in order, if the numbers came back worse on another machine:

1. Hoist the comment-delimiter test behind the same `charCodeAt` load already
   being done, rather than adding a second load.
2. Drop the stray `*/` check at depth > 0. A `*/` inside parens can only close a
   comment that some other value opened, and an unclosed `/*` is refused, so the
   pair cannot occur. This trades a small amount of paranoia for one branch.
3. Report `unterminated-comment` without tracking `commentStart`, losing the
   squiggle position but not the refusal.

And the answer if none of that pays for it: **the item does not ship**. Keeping a
faster second implementation as a "fast path" is the exact shape this item
exists to delete, and a fork that is 3% faster is still a fork.

## Migration: one change, no cross-check period

Retire the predicate in the same change.

The argument for running both side by side and warning on disagreement is that it
would catch a case the tests miss. It would not, and it costs more than it
returns:

- **The disagreement set is already known exactly.** Three values, listed above,
  found by running both implementations over every literal in both suites plus
  645 vectors and 800 corpus cases. A cross-check would report those three and
  nothing else.
- **A cross-check is a second implementation of the thing being deleted.** For
  the duration, `scanFlatValue`'s new states and the predicate's old ones both
  live, and any bug found during the window has two places to be fixed.
- **Nobody could act on the warning.** It would fire in an app, in a value the
  author did not write, naming two internal implementations.
- **The safety net is the cross-check.** 73 injection tests pinning both
  directions, 21 permissive controls, the agreement corpus in both directions,
  645 Rust vectors. That is a better oracle than a runtime comparison, and it
  runs in CI on every push.

Order within the change: lexer states first with the grammar's own tests, then
the Rust port and regenerated vectors, then the guard reduced to a lexer call,
then the three flipped expectations with their receipts, then the new tests. The
guard cannot be reduced before the lexer is faithful, and the Rust port cannot
lag, because `checks.yaml` runs `--check` and `cargo test --workspace` together.

## What could go wrong

- **The newline-in-string branch re-reads its character.** After ending a string
  at a newline, the scan steps back one index so the newline is processed at the
  level it returned to. It cannot loop (the quote is cleared first) but it is the
  one place in the loop where the index moves backwards, and anyone adding state
  there needs to know.
- **`url(` detection is a lookahead, and lookaheads are where bypass 4 lived.**
  `myurl(` must stay an ordinary function and `url("...")` must keep its real
  string. Both are pinned; both need to stay pinned after the code moves.
- **The widened fast reject is now load-bearing for correctness, not just
  speed.** If someone later narrows it back for performance, the sixth class
  reopens silently. It needs a comment saying so and a test whose value carries
  a construct character but none of `;{}`.
- **Comment ranking is subtle in one direction only.** A string outranks a
  comment opener (`"/*"` is a two-character string), a comment outranks a quote,
  and `url(` outranks both. Getting the order wrong produces a scan that passes
  every existing test and fails on one payload nobody wrote down.
- **The `getCSSStylesAtomic` values are not flat-value grammar.** They come from
  react-native-web's flattened style objects, so the lexer will see values it was
  not designed for and will call `chain()` on any top-level colon. With a
  permissive hoisted visitor that is inert, but it is a new coupling between a
  react-native-web code path and the grammar's lexer, and it should be stated in
  the guard's comment rather than discovered.

## What I did not do

- I did not run the two suites against the prototype. That would mean swapping a
  tracked source file during a push freeze in a shared checkout. The differential
  covers every string literal in both files, which is the same question with no
  risk to co-tenants.
- I did not verify the SSR consequence on a rendered page. The CSSOM receipts are
  from a style tag built the way `createAtomicRules` builds rules and joined the
  way `createDesignSystem` joins them, which is one step short of a real page.
- I did not measure on a native device. `bench/parse-cost.mjs` runs under Bun on
  this machine, which is what item 12 used, and the comparison is like for like.

## Evidence appendix

Every number above came from one of these, all run on 2026-08-18 on this tree at
`ccfd0198cd`:

- **the prototype**: a scratchpad copy of `scanFlatValue.ts` with the three
  states, plus a copy of `valueParser.ts` importing it. Nothing in the repo was
  modified.
- **the differential**: both lexers over the 645 Rust vectors, both agreement
  corpora at the suites' own seeds (`0xa9ee01`, `0xb17e02`) with
  `distinctSingleModifiers` and `escapes: 'delimiter-free'`, every literal
  extracted from both test files by regex and `eval`, and the 15 url/string cases
  from `valueParser.test.ts`.
- **the benches**: `bench/parse-cost.mjs`'s harness shape (50k warmup, scale to
  ~250 ms, median of three), run three times per variant.
- **Chromium**: `playwright` from this repo's `node_modules`, one style tag per
  case, reading `sheet.cssRules` back.
- **the end-to-end probe**: a temporary test file in `code/core/core-test` driven
  through `simplifiedGetSplitStyles`, deleted immediately after; that is where
  rows A and B of the disagreement table come from.

One process note worth keeping. While writing the D6 probe I wrote `'safe\;tail'`
in a JS string, which is `safe;tail`, and got a confident wrong answer for one
run: the same trap that made a test in the injection suite unable to fail. It
took writing the backslash as `String.fromCharCode(92)` to be sure. Anything in
this proposal that depends on an escape was re-run that way.
