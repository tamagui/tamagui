// let it be called as a template string tag function

// intra-render marker segments are sub-millisecond even on Hermes; any delta
// larger than this is the gap React/idle spends BETWEEN our markers (reconcile,
// rAF, setTimeout, network). routing those to an ignored bucket keeps real
// per-segment costs honest instead of letting one marker absorb the idle time.
const GAP_MS = 1

export function timer() {
  let runs = 0
  const timings: Record<string, number> = {}
  const counts: Record<string, number> = {}

  function print() {
    let totalTime = 0
    const names = Object.keys(timings)

    const out = [
      `Ran ${runs} marker calls across ${names.length} segments`,
      ...names.map((name) => {
        const count = counts[name] || 1
        const total = timings[name]
        const avg = `avg ${`${total / count}`.slice(0, 9).padEnd(9)}ms`
        if (!name.endsWith('(ignore)')) {
          // avoid counting (ignore)/gap timings towards the real segment total
          totalTime += total
        }
        return `${name.slice(0, 30).padStart(31)} | ${avg} | total ${`${total}`.slice(0, 8)}ms | n=${count}`
      }),
      `                                    total ${totalTime}ms (excludes gap/ignore)`,
    ].join('\n')

    console.info(out)
    return out
  }

  return {
    start(opts?: { quiet?: boolean }) {
      const quiet = opts?.quiet ?? true

      function time(strings: TemplateStringsArray, ...vars: any[]) {
        const now = performance.now()
        const elapsed = now - start
        const tag = templateToString(strings, ...vars)
        // large deltas are inter-render gaps, not this segment's real cost
        const bucket = elapsed > GAP_MS && !tag.endsWith('(ignore)') ? '~gap (ignore)' : tag
        runs++
        timings[bucket] = (timings[bucket] || 0) + elapsed
        counts[bucket] = (counts[bucket] || 0) + 1
        if (!quiet) {
          let result = ''
          strings.forEach((str, i) => {
            result += `${str}${i === strings.length - 1 ? '' : vars[i]}`
          })
          console.info(`${`${elapsed}ms`.slice(0, 6).padStart(7)} |`, result)
        }
        start = now
      }

      let start = performance.now()
      time['print'] = print

      return time
    },

    profile() {
      return {
        timings,
        runs,
      }
    },

    print,
  }
}

function templateToString(strings: TemplateStringsArray, ...vars: any[]): string {
  return strings.reduce(
    (result, str, i) => result + str + (vars[i] !== undefined ? vars[i] : ''),
    ''
  )
}
