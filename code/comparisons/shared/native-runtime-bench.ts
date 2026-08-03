import {
  NATIVE_RUNTIME_FIXTURE_VERSION,
  NATIVE_RUNTIME_SCENARIOS,
  type NativeRuntimeScenario,
} from './native-bench-spec'

export {
  NATIVE_RUNTIME_FIXTURE_VERSION,
  NATIVE_RUNTIME_SCENARIOS,
  type NativeRuntimeScenario,
} from './native-bench-spec'

const ITEM_COUNT = 200
const HEAVY_COUNT = 60
const HARNESS_URL = 'http://localhost:8091/result'

type CreateNativeRuntimeBenchOptions = {
  React: any
  Linking: { parse(url: string): { queryParams?: Record<string, unknown> } }
  useURL(): string | null
  RNView: any
  RNText: any
  TamaguiProvider: any
  GroupContext: any
  View: any
  Button: any
  getVariableValue(value: unknown): unknown
  usePropsAndStyle(
    props: Record<string, unknown>,
    options?: Record<string, unknown>
  ): [Record<string, unknown>, Record<string, unknown>]
  config: any
  version: 'v2' | 'v3'
  framework: string
}

export function createNativeRuntimeBenchApp({
  React,
  Linking,
  useURL,
  RNView,
  RNText,
  TamaguiProvider,
  GroupContext,
  View,
  Button,
  getVariableValue,
  usePropsAndStyle,
  config,
  version,
  framework: defaultFramework,
}: CreateNativeRuntimeBenchOptions) {
  const {
    createElement,
    Fragment,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
  } = React
  const normalizeStyle = (style: Record<string, unknown>, keys: readonly string[]) =>
    Object.fromEntries(
      keys.flatMap((key) =>
        style[key] === undefined ? [] : [[key, getVariableValue(style[key])]]
      )
    )
  const tokenNames = [
    '3',
    'blue3',
    'blue5',
    'blue7',
    'blue8',
    'blue9',
    'green5',
    'gray1',
    'gray2',
    'gray3',
    'gray4',
    'gray6',
    'gray8',
    'gray11',
    'orange5',
    'pink5',
  ]
  const tokenValues = Object.fromEntries(
    tokenNames.map((name) => [name, version === 'v2' ? `$${name}` : name])
  )
  const token = (name: string) => tokenValues[name]!
  const runtimeBehaviorProps = {
    static: {
      width: 20,
      height: 20,
      backgroundColor: 'rgb(99,102,241)',
      borderRadius: 3,
      margin: 1,
    },
    token: {
      width: 20,
      height: 20,
      backgroundColor: token('blue5'),
    },
    pseudo:
      version === 'v2'
        ? {
            disabled: true,
            opacity: 1,
            backgroundColor: 'rgb(99,102,241)',
            disabledStyle: {
              opacity: 0.4,
              backgroundColor: 'rgb(79,70,229)',
            },
          }
        : {
            disabled: true,
            opacity: '1 disabled:0.4',
            backgroundColor: 'rgb(99,102,241) disabled:rgb(79,70,229)',
          },
    group:
      version === 'v2'
        ? {
            backgroundColor: token('blue5'),
            '$group-row-hover:backgroundColor': token('blue7'),
          }
        : { backgroundColor: 'blue5 group-hover/row:blue7' },
    component: {
      size: token('3'),
      theme: 'blue',
      margin: 1,
      opacity: 0.8,
    },
  }
  const richInteractionProps =
    version === 'v2'
      ? {
          borderColor: 'rgba(0,0,0,0.1)',
          hoverStyle: { borderColor: 'rgba(0,0,0,0.3)', scale: 1.02 },
          pressStyle: { opacity: 0.8, scale: 0.98 },
        }
      : {
          borderColor: 'rgba(0,0,0,0.1) hover:rgba(0,0,0,0.3)',
          scale: 'hover:1.02 press:0.98',
          opacity: 'press:0.8',
        }
  const groupParentInteractionProps =
    version === 'v2'
      ? {
          backgroundColor: token('gray2'),
          hoverStyle: { backgroundColor: token('gray3') },
        }
      : { backgroundColor: 'gray2 hover:gray3' }
  const groupAvatarInteractionProps =
    version === 'v2'
      ? {
          backgroundColor: token('blue5'),
          '$group-row-hover:backgroundColor': token('blue7'),
        }
      : { backgroundColor: 'blue5 group-hover/row:blue7' }
  const groupBarInteractionProps =
    version === 'v2'
      ? {
          backgroundColor: token('gray8'),
          '$group-row-hover:backgroundColor': token('blue8'),
        }
      : { backgroundColor: 'gray8 group-hover/row:blue8' }
  const heavyParentInteractionProps =
    version === 'v2'
      ? {
          backgroundColor: token('gray1'),
          borderColor: token('gray4'),
          hoverStyle: {
            backgroundColor: token('gray2'),
            borderColor: token('gray6'),
          },
        }
      : {
          backgroundColor: 'gray1 hover:gray2',
          borderColor: 'gray4 hover:gray6',
        }
  const heavyAvatarInteractionProps =
    version === 'v2'
      ? { opacity: 1, '$group-card-hover:opacity': 0.8 }
      : { opacity: 'group-hover/card:0.8' }
  const heavyTitleInteractionProps =
    version === 'v2'
      ? {
          backgroundColor: token('gray11'),
          '$group-card-hover:backgroundColor': token('blue9'),
        }
      : { backgroundColor: 'gray11 group-hover/card:blue9' }
  const heavyBadgeInteractionProps =
    version === 'v2'
      ? {
          backgroundColor: token('blue3'),
          '$group-card-hover:backgroundColor': token('blue5'),
        }
      : { backgroundColor: 'blue3 group-hover/card:blue5' }
  type RenderState = { instance: number; revision: number }

  function SimpleItems({ instance, revision }: RenderState) {
    return useMemo(() => {
      const items = []
      for (let index = 0; index < ITEM_COUNT; index++) {
        items.push(
          createElement(View, {
            key: index + instance * ITEM_COUNT,
            width: 20,
            height: 20,
            backgroundColor: revision === 0 ? 'rgb(99,102,241)' : 'rgb(79,70,229)',
            borderRadius: 3,
            margin: 1,
          })
        )
      }
      return createElement(Fragment, null, ...items)
    }, [instance, revision])
  }

  function ThemedItems({ instance, revision }: RenderState) {
    return useMemo(() => {
      const items = []
      for (let index = 0; index < ITEM_COUNT; index++) {
        items.push(
          createElement(View, {
            key: index + instance * ITEM_COUNT,
            width: 20,
            height: 20,
            backgroundColor: token(revision === 0 ? 'blue5' : 'blue7'),
            borderRadius: 3,
            margin: 1,
          })
        )
      }
      return createElement(Fragment, null, ...items)
    }, [instance, revision])
  }

  function RichItems({ instance, revision }: RenderState) {
    return useMemo(() => {
      const items = []
      for (let index = 0; index < ITEM_COUNT; index++) {
        items.push(
          createElement(View, {
            key: index + instance * ITEM_COUNT,
            width: 60,
            height: 40,
            borderRadius: 6,
            padding: 4,
            borderWidth: 1,
            backgroundColor: revision === 0 ? 'rgb(99,102,241)' : 'rgb(79,70,229)',
            margin: 1,
            ...richInteractionProps,
          })
        )
      }
      return createElement(Fragment, null, ...items)
    }, [instance, revision])
  }

  function GroupItems({ instance, revision }: RenderState) {
    return useMemo(() => {
      const items = []
      for (let index = 0; index < ITEM_COUNT; index++) {
        items.push(
          createElement(
            View,
            {
              key: index + instance * ITEM_COUNT,
              group: 'row',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              padding: revision === 0 ? 8 : 10,
              borderRadius: 8,
              margin: 1,
              ...groupParentInteractionProps,
            },
            createElement(View, {
              width: 32,
              height: 32,
              borderRadius: 16,
              ...groupAvatarInteractionProps,
            }),
            createElement(
              View,
              { flex: 1 },
              createElement(View, {
                height: 10,
                borderRadius: 4,
                ...groupBarInteractionProps,
              })
            )
          )
        )
      }
      return createElement(Fragment, null, ...items)
    }, [instance, revision])
  }

  const cardColors = ['blue5', 'green5', 'pink5', 'orange5']

  function HeavyItems({ instance, revision }: RenderState) {
    return useMemo(() => {
      const items = []
      for (let index = 0; index < HEAVY_COUNT; index++) {
        const color = token(cardColors[(index + revision) % cardColors.length]!)
        items.push(
          createElement(
            View,
            {
              key: index + instance * HEAVY_COUNT,
              group: 'card',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 4,
              ...heavyParentInteractionProps,
            },
            createElement(View, {
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: color,
              ...heavyAvatarInteractionProps,
            }),
            createElement(
              View,
              { flex: 1, gap: 4 },
              createElement(View, {
                height: 12,
                borderRadius: 4,
                width: 80 + ((index * 17) % 60),
                ...heavyTitleInteractionProps,
              }),
              createElement(View, {
                height: 10,
                borderRadius: 3,
                backgroundColor: token('gray8'),
                width: 120 + ((index * 13) % 80),
              })
            ),
            createElement(
              View,
              {
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 6,
                ...heavyBadgeInteractionProps,
              },
              createElement(View, {
                width: 24,
                height: 8,
                borderRadius: 3,
                backgroundColor: token('blue9'),
              })
            )
          )
        )
      }
      return createElement(Fragment, null, ...items)
    }, [instance, revision])
  }

  function ComponentItems({ instance, revision }: RenderState) {
    return useMemo(() => {
      const items = []
      for (let index = 0; index < HEAVY_COUNT; index++) {
        items.push(
          createElement(
            Button,
            {
              key: index + instance * HEAVY_COUNT,
              size: token('3'),
              theme: 'blue',
              margin: 1,
              opacity: revision === 0 ? 1 : 0.8,
            },
            `Button ${index}`
          )
        )
      }
      return createElement(Fragment, null, ...items)
    }, [instance, revision])
  }

  const scenarioComponents: Record<NativeRuntimeScenario, any> = {
    simple: SimpleItems,
    themed: ThemedItems,
    rich: RichItems,
    group: GroupItems,
    heavy: HeavyItems,
    component: ComponentItems,
  }

  function GroupBehaviorProbe({ onResolved }: { onResolved(style: object): void }) {
    const [, style] = usePropsAndStyle(runtimeBehaviorProps.group, { noMedia: true })
    const signature = JSON.stringify(style)
    useLayoutEffect(() => {
      if (getVariableValue(style.backgroundColor) === '#2563eb') {
        onResolved(normalizeStyle(style, ['backgroundColor']))
      }
    }, [onResolved, signature])
    return null
  }

  function RuntimeBehaviorGate({ onReady }: { onReady(signature: object): void }) {
    const [, staticStyle] = usePropsAndStyle(runtimeBehaviorProps.static, {
      noMedia: true,
    })
    const [, tokenStyle] = usePropsAndStyle(runtimeBehaviorProps.token, {
      noMedia: true,
    })
    const [, pseudoStyle] = usePropsAndStyle(runtimeBehaviorProps.pseudo, {
      noMedia: true,
    })
    const [, componentStyle] = usePropsAndStyle(runtimeBehaviorProps.component, {
      forComponent: Button,
      noMedia: true,
    })
    const [groupStyle, setGroupStyle] = useState(null as object | null)
    const handleGroupStyle = useCallback(
      (style: object) => setGroupStyle((current: object | null) => current ?? style),
      []
    )
    const groupContext = useMemo(() => {
      const state = { pseudo: { hover: true } }
      return {
        row: {
          state,
          subscribe(listener: (next: typeof state) => void) {
            listener(state)
            return () => {}
          },
        },
      }
    }, [])
    const signature = useMemo(
      () => ({
        version: 1,
        static: normalizeStyle(staticStyle, [
          'width',
          'height',
          'backgroundColor',
          'borderTopLeftRadius',
          'borderTopRightRadius',
          'borderBottomRightRadius',
          'borderBottomLeftRadius',
          'marginTop',
          'marginRight',
          'marginBottom',
          'marginLeft',
        ]),
        token: normalizeStyle(tokenStyle, ['width', 'height', 'backgroundColor']),
        pseudo: normalizeStyle(pseudoStyle, ['opacity', 'backgroundColor']),
        component: normalizeStyle(componentStyle, [
          'height',
          'minHeight',
          'paddingLeft',
          'paddingRight',
          'borderTopLeftRadius',
          'backgroundColor',
          'color',
          'opacity',
        ]),
        componentName: Button.staticConfig?.componentName ?? null,
      }),
      [componentStyle, pseudoStyle, staticStyle, tokenStyle]
    )

    useLayoutEffect(() => {
      if (!groupStyle) return
      const completeSignature = { ...signature, group: groupStyle }
      const expected = {
        static: {
          width: 20,
          height: 20,
          backgroundColor: 'rgb(99,102,241)',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          borderBottomRightRadius: 3,
          borderBottomLeftRadius: 3,
          marginTop: 1,
          marginRight: 1,
          marginBottom: 1,
          marginLeft: 1,
        },
        token: { width: 20, height: 20, backgroundColor: '#60a5fa' },
        pseudo: { opacity: 0.4, backgroundColor: 'rgb(79,70,229)' },
        group: { backgroundColor: '#2563eb' },
      }
      for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
        if (JSON.stringify(completeSignature[key]) !== JSON.stringify(expected[key])) {
          throw new Error(
            `native runtime behavior mismatch for ${key}: ${JSON.stringify(completeSignature[key])}`
          )
        }
      }
      if (
        typeof completeSignature.componentName !== 'string' ||
        completeSignature.component.opacity !== 0.8
      ) {
        throw new Error(
          `native component behavior mismatch: ${JSON.stringify(completeSignature.component)}`
        )
      }
      onReady(completeSignature)
    }, [groupStyle, onReady, signature])

    return createElement(
      GroupContext.Provider,
      { value: groupContext },
      createElement(GroupBehaviorProbe, { onResolved: handleGroupStyle })
    )
  }

  function BenchRunner({
    scenarioId,
    onResult,
  }: {
    scenarioId: NativeRuntimeScenario
    onResult(result: { mount: number; update: number; remount: number }): void
  }) {
    const [phase, setPhase] = useState('idle')
    const [instance, setInstance] = useState(0)
    const [revision, setRevision] = useState(0)
    const startRef = useRef(0)
    const mountTimeRef = useRef(0)
    const updateTimeRef = useRef(0)
    const Component = scenarioComponents[scenarioId]

    useLayoutEffect(() => {
      if (phase === 'mounting') {
        mountTimeRef.current = performance.now() - startRef.current
        setPhase('mounted')
      } else if (phase === 'mounted') {
        requestAnimationFrame(() => {
          startRef.current = performance.now()
          setPhase('updating')
          setRevision(1)
        })
      } else if (phase === 'updating') {
        updateTimeRef.current = performance.now() - startRef.current
        setPhase('updated')
      } else if (phase === 'updated') {
        requestAnimationFrame(() => {
          startRef.current = performance.now()
          setPhase('remounting')
          setInstance(2)
        })
      } else if (phase === 'remounting') {
        onResult({
          mount: mountTimeRef.current,
          update: updateTimeRef.current,
          remount: performance.now() - startRef.current,
        })
        setPhase('done')
      }
    }, [phase, onResult])

    useEffect(() => {
      const timeout = setTimeout(() => {
        startRef.current = performance.now()
        setPhase('mounting')
        setInstance(1)
      }, 100)
      return () => clearTimeout(timeout)
    }, [])

    if (phase === 'idle') return null

    return createElement(
      RNView,
      { style: { flexDirection: 'row', flexWrap: 'wrap', maxWidth: 600 } },
      createElement(Component, { instance, revision })
    )
  }

  return function NativeRuntimeBenchApp() {
    const url = useURL()
    let scenario: NativeRuntimeScenario | null = null
    let framework = defaultFramework
    let run = ''
    const [behaviorSignature, setBehaviorSignature] = useState(null as object | null)
    if (url) {
      const params = Linking.parse(url).queryParams
      const requestedScenario = String(params?.case ?? '')
      if ((NATIVE_RUNTIME_SCENARIOS as readonly string[]).includes(requestedScenario)) {
        scenario = requestedScenario as NativeRuntimeScenario
      }
      if (params?.fw) framework = String(params.fw)
      if (params?.run) run = String(params.run)
    }

    const handleResult = useCallback(
      (result: { mount: number; update: number; remount: number }) => {
        if (!scenario || !run || !behaviorSignature) return
        fetch(HARNESS_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            framework,
            scenario,
            run,
            fixtureVersion: NATIVE_RUNTIME_FIXTURE_VERSION,
            behaviorSignature,
            ...result,
          }),
        }).catch(() => {})
      },
      [behaviorSignature, framework, run, scenario]
    )

    return createElement(
      TamaguiProvider,
      { config, defaultTheme: 'light' },
      createElement(
        RNView,
        {
          style: {
            flex: 1,
            backgroundColor: '#ffffff',
            paddingTop: 60,
            alignItems: 'flex-start',
          },
        },
        scenario
          ? createElement(
              RNView,
              { key: url ?? '' },
              createElement(
                RNText,
                { style: { padding: 8, fontSize: 12, color: '#666' } },
                `${framework} · ${scenario} · ${run}`
              ),
              behaviorSignature
                ? createElement(BenchRunner, {
                    scenarioId: scenario,
                    onResult: handleResult,
                  })
                : createElement(RuntimeBehaviorGate, { onReady: setBehaviorSignature })
            )
          : createElement(
              RNText,
              { style: { padding: 20 } },
              'waiting for a benchmark deep link'
            )
      )
    )
  }
}
