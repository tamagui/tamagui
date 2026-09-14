# V3 compiler retention follow-ups

Status: evidence-backed proposals found while characterizing the engine
consolidation boundary. None is part of the consolidation campaign, and none
is authorized for implementation by this record.

## Measurement boundary

The checked kitchen-sink web metric found 2,645 candidates: 2,128 fully
flattened, 20 partially lowered but retained, and 497 bailouts. Only the 497
bailouts are classified by reason. Counts and probes below describe compiler
retention; they do not change the engine campaign's CORE or parser-cluster
targets.

Probe source and output are `/tmp/tamagui-retention-probes.ts` and
`/tmp/tamagui-retention-probes.out`. The independent scanner-boundary build
report is `/tmp/tamagui-scan-boundary-p29160/report.txt`.

## False-valued special props retain components

Three independent compiler branches retain a component when a special prop is
present, even when its materialized value is false:

- `asChild={false}` retains at `compilerHost.ts:1797-1810`;
- `disableOptimization={false}` retains at `compilerHost.ts:1511-1520`;
- `themeInverse={false}` retains at `compilerHost.ts:1784-1795`.

Each positive control retained on both web and native. The corresponding
static `View` control flattened. Active `asChild` and theme boundaries require
runtime behavior, and a true `disableOptimization` is an intentional opt-out.
The false-valued cases request none of those semantics, so their retention is
a defect in three presence-based decision branches. A future fix should change
the decisions at their source and prove both halves: false values flatten,
while active values still retain. It should also test the same keys inside a
statically materialized spread, because those branches inspect own spread
entries as well as direct props.

This work can make affected components smaller and faster, but it does not
make the scanner optional for a realistic application. One other retained
`createComponent` still pulls the runtime graph.

## Opaque dynamic styles retain the full component

Opaque web `backgroundColor={color}` and `width={n + 1}` probes each partially
lowered but remained on `createComponent`; opaque native values bailed. In
contrast, proven numeric domains and static conditional branches flatten, and
existing `e3-lowerer.web.test.ts` coverage proves the same distinction. Runtime
variability is real. Retaining the full Tamagui component after safe static
siblings have been identified is often a compiler limitation involving style
ownership, atomic specificity, and transactional rewriting. Any proposal here
must preserve duplicate-prop order and the winner between retained runtime
styles and extracted atomic styles. The evidence does not establish one safe
general lowering rule yet.

## Native clause programs retain wholesale

On native, any active complete prop or selected variant definition matching the
flat-clause shape retains the component before style splitting. The probe
`backgroundColor="red hover:blue"` flattened on web and retained on native.
Separately, native group and container providers retain because descendants
consume their published context; that provider retention is inherent. The
blanket rule for every native conditional value is a compiler limitation, but
the evidence does not yet prove which clause subsets can lower safely. A future
proposal must separate lifecycle, group/container subscription, live media or
pseudo state, and purely static platform clauses, with an executable control
for each accepted subset.

## Relation to the engine campaign

Fully flattened React, static `View`, and provider-plus-static-`View` builds
omit `scanFlatValue`. Adding one static literal `View` retained only by active
`asChild` brought back 2,004 mapped minified scanner bytes and 755 marginal
gzip. The engine phases therefore make retained components cheaper. Compiler
retention changes belong in separate work and do not substitute for the
retained grammar's size target.
