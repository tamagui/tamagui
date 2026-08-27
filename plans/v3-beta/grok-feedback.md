The product call is right: keep objects, one clause sink, no second web engine. The sequence and a few of the mechanical designs will stall the same way the
last two plans did.

What to keep

• Objects as a thin adapter into the same sink. The corpus already says they are cheaper than strings (6.2 µs vs 9.6 µs) and rare (14 object elements vs 625
clause-string ones). 250 extra gzip is the correct instinct.
• One character loop, no split / regex / Object.keys / clause arrays / Set / sort on the render path.
• Delete the replaced path in the same commit. No flag, no shadow engine.
• Freeze the ruler before any engine edit, and keep V2 as a same-run control.
• Group is not a query container. That coupling is real (getSplitStyles.tsx around 756–770 still writes container-name / container-type for group).
• usePresence always called, effect always runs, register only after the completed frame says so. That was already settled and this plan carries it.
• TAMAGUI_DID_OUTPUT_CSS and strict mode cannot be used to hide a fat processor.

The holes that will stop you mid-change

1. Fixed numeric slots were already tried and withdrawn.

v3-engine-consolidation.md revision 3 is explicit: no fixed condition slots. A functional variant sm:$v can return { color: 'hover:red' }, so an inner clause
is live in the same pass as the outer one. Condition state has to travel as call-stack locals. Across user code, only source offsets survive, then you re-
derive.

This plan puts the slots back (line 215) and only mentions re-derivation in passing. Same-frame nesting will corrupt the outer five slots, or you will grow a
slot stack, which is the arena that 1a paid +279 CORE for and then reverted. Pick one and write it down:

• call-stack locals plus offset re-derivation at user-code boundaries (already designed, already pinned), or
• a watermarked numeric stack with a measured size budget.

Do not leave “fixed slots” as the runtime shape.

2. The 3,000-byte nucleus is not a real metric yet.

There is no source manifest. Last campaign’s parser cluster, a smaller union than “scanner + emit + tokens + transforms + variants”, measured 4,706 gzip and
the 1,000 target was abandoned as unreachable. directStyle alone is 12,742 gzip leaf in this plan’s own table. getSplitStyles is 21,639.

If nucleus includes getSplitStyles (asChild, HOC, viewProps, class assembly), 3k is impossible. If it is only the clause machine, 3k might be a real gate, but
then checkpoints 3–6 cannot be judged against it. Checkpoint 0 has to list the declarations, measure the current union, and set the number from that pool. A
wish with no pool will fail at checkpoint 6 with no information.

Split the number:

• clause machine (scan, resolve, slots, object adapter): hard cap, maybe 3k once you have the current union
• property emitters (tokens, border, shadow, transform, atomic insert): reported, must not grow, not stuffed into the 3k

3. View 25k is the wrong gate for checkpoint 6.

Current View is 34k gzip with React external. That graph still contains theme, media, insert, config, presence, layout. Checkpoints 2–6 do not remove those.
Using 25k as an engine-stop will fail for reasons this campaign does not own. That is the same class of error as using CORE 30k as a parser-cluster stop.

Checkpoint 6 should stop on clause-union gzip, the 5x (or honest substitute), and the behavior pins. Report View. Put 25k / 20k on the later theme/provider
work.

4. Three-source traversal vs extras.props is a declined design, written back in.

Walking defaults, context, and caller props directly, while also keeping extras.props as a full record and banning Proxy, is exactly 1b. plans/v3-functional-
variant-props-contract.md already priced it: mergeComponentProps still has to build nextProps for variants, compounds, state, and forwarded view props. A
second representation is a new allocation and a public break for Button, SizableText, Input, Slider, Tabs.

Keep mergeComponentProps. Do not make “one authored-input traversal of three sources” part of this campaign. The one traversal that matters is each value
(string, object, variant result) going through the sink once.

5. Open-ended names do not fit in a closed ID table.

hover / sm / dark / web can be compiled IDs. group-hover/card and @sm/layout cannot. User-authored group and container names are unbounded. addTheme makes
theme names unbounded after definition time too.

You need a closed vocab plus an intern for parameterized names. Process-lifetime intern leaks. Per-pass intern allocates. Span comparison against the source
(what revision 3 already specified for the rare parameterized forms) allocates nothing. Write that. “Collision-free numeric IDs” as stated will grow a Map or
go stale.

6. getSubStyle is a second engine and the plan barely names it.

It still calls propMapper, overlays styleState.props for functional variants (the kind=danger pin), and has its own transform merge. If component styling must
not import propMapper, getSubStyle has to use the same sink in the same checkpoint that deletes the mapper. Leave it and you have not deleted the old engine.

Also missing as named work: the style prop’s RNW $$css map, tokenLookup (module singleton, reentrancy-unsafe, still in directStyle.ts:677), and parseValue in
the runtime graph.

7. One file fights the three product modes.

getSplitStyles.tsx always stays imported by View. Strict compiled and TAMAGUI_DID_OUTPUT_CSS only drop code that is behind process.env.* from day one. If
atomic hashing and insertion are written as ordinary code and “specialized” in checkpoint 7, you will rewrite the emitter.

Constraint on checkpoint 2: CSS rule generation, hashing, and insertion live in if (process.env.TAMAGUI_DID_OUTPUT_CSS !== '1') (or the actual compile-time
constant you already own). Native-only lowering lives in TAMAGUI_TARGET === 'native'. Do not wait.

Runtime scanner should not import parseValue. Tooling can keep its parser. Proving parseValue is absent from the View chunk is a real size win. Unifying them
is how you ship diagnostics into the app, which is what the last parser-unification paid for.

8. The 5x number is likely the wrong shape.

Conditional strings are 9,566 ns. Plain is 2,127 ns. 5x lands at 1,914 ns, faster than plain, while still parsing modifiers and emitting extra clauses. You
already took clause strings from 22,189 ns to ~7.6–9.5k. A further causal 17% is what the last retained optimization actually bought.

5x is only believable if checkpoint 0’s profile-hotpath on that scenario names the frames that die (Condition, Sets, sort, source.slice per modifier, wrapper
arrays, string-key identity) and those frames are most of the 9.5k. Gate on those frames disappearing, plus a 3x floor. If the frames are gone and you have
3x, that is success information. If you hit 5x with the frames still in the profile, the machine moved.
