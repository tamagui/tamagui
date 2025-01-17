// let it be called as a template string tag function

export function timer() {
  let runs = 0
  const typesOfRuns = new Set<string>()
  const timings: Record<string, number> = {}

  function print() {
    const typeRuns = runs / typesOfRuns.size
    let totalTime = 0

    const out = [
      `Ran ${typeRuns} per-type, ${runs} total`,
      ...[...typesOfRuns].map((name) => {
        const avg = `avg ${`${timings[name] / typeRuns}`.slice(0, 9).padEnd(9)}ms`
        const total = timings[name]
        totalTime += total
        return `${name.slice(0, 30).padStart(31)} | ${avg} | total ${total}ms`
      }),
      `                                    total ${totalTime}ms`,
    ].join('\n')

    console.info(out)
    return out
  }

  return {
    start(opts?: { quiet?: boolean }) {
      const quiet = opts?.quiet ?? true

      function time(strings: TemplateStringsArray, ...vars: any[]) {
        const elapsed = performance.now() - start
        const tag = templateToString(strings, ...vars)
        typesOfRuns.add(tag)
        runs++
        timings[tag] ??= 0
        timings[tag] += elapsed
        if (!quiet) {
          let result = ''
          strings.forEach((str, i) => {
            result += `${str}${i === strings.length - 1 ? '' : vars[i]}`
          })
          console.info(`${`${elapsed}ms`.slice(0, 6).padStart(7)} |`, result)
        }
        start = performance.now()
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
