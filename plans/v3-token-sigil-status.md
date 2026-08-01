# Is `$` staying in tokens? No — but the migration hasn't happened yet

Written 2026-07-31 because the question came up from seeing `hover:$color5` in
V3 work and assuming the plan was to drop `$`. Recording the answer here rather
than in a chat message, since it will be asked again.

## The decision: `$` is removed from flat candidate syntax

From `plans/dom-tailwind-flat-values.md`, in the section selecting the value
grammar:

> The selected syntax is the universal value grammar … **This removes `$`** and
> uses one parser for every property.

That section explicitly rejects two alternatives, one of which is "keeping `$`
in candidate atoms". The target spelling is:

```tsx
bg="red-500 hover:blue-500"
```

## What is deliberately not done yet

The same section carves this out, verbatim:

> Underlying config storage **may still use `$` until the token representation
> is migrated**, but `$` is absent from the new flat candidate syntax.

So `$` is gone from the new flat candidate syntax by design, and deliberately
retained in config and token storage until the token-representation migration.
That migration has not happened.

## Why you still see `$` today

`ColorTokens` and the other token unions are still the `$`-prefixed unions, so
anything reading today's *type surface* reports `$`-prefixed values. A probe
showing `bg="hover:$color5"` is an accurate description of current state, not
the V3 target spelling. In V3 flat-value syntax it reads `hover:color5`.

The two spellings coexist right now — `$` in config and token types, no `$` in
flat candidate values — and that is expected rather than broken.

## Why it wasn't done as part of the beta

Changing the token representation is a config-level change, not a parser tweak.
It touches token storage, the token type unions, the codemod, and every
documentation example. It is larger than the remaining beta work and should be
planned as its own piece with the blast radius measured, rather than wedged into
a close-out.
