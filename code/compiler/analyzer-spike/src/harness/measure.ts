import assert from 'node:assert/strict'
import { performance } from 'node:perf_hooks'

import {
  ProjectGraph,
  resolvedModuleId,
  type CandidateFactory,
  type HostModuleInput,
} from '@tamagui/compiler-core'
import { createGeneratedProject, hostResolvedProjectFromInput } from '../fixture'

export interface Distribution {
  medianMs: number
  p95Ms: number
  samples: number
}

export interface MemoryMeasurement {
  heapDeltaBytes: number
  rssDeltaBytes: number
}

export interface CandidateMeasurement {
  candidate: CandidateFactory['name']
  moduleCount: number
  cold: Distribution
  warm: Distribution
  warmToColdRatio: number
  memory: MemoryMeasurement
  unaffectedReparseCount: number
  affectedModuleCount: number
  gates: {
    warmUnder50Ms: boolean
    warmUnder25PercentCold: boolean
    exactInvalidation: boolean
    noUnaffectedReparse: boolean
  }
}

function distribution(samples: number[]): Distribution {
  const sorted = [...samples].sort((a, b) => a - b)
  const percentile = (value: number) => sorted[Math.ceil(sorted.length * value) - 1] ?? 0
  return {
    medianMs: percentile(0.5),
    p95Ms: percentile(0.95),
    samples: sorted.length,
  }
}

function collectGarbage(): void {
  const gc = (globalThis as typeof globalThis & { gc?: () => void }).gc
  gc?.()
}

export function measureCandidateTiming(
  factory: CandidateFactory,
  moduleCount = 1_000
): Omit<CandidateMeasurement, 'memory'> {
  const project = createGeneratedProject(moduleCount)
  const hostProject = hostResolvedProjectFromInput(project)
  const affectedFinalIndex = moduleCount / 2 - 1
  const unaffectedRootIndex = moduleCount / 2
  const unaffectedFinalIndex = moduleCount - 1
  const affectedFinalId = `/generated/module-${affectedFinalIndex}.ts`
  const affectedFinalName = `value${affectedFinalIndex}`
  const unaffectedFinalId = `/generated/module-${unaffectedFinalIndex}.ts`
  const unaffectedFinalName = `value${unaffectedFinalIndex}`
  const coldSamples: number[] = []

  for (let sample = 0; sample < 10; sample++) {
    collectGarbage()
    const start = performance.now()
    const graph = new ProjectGraph(factory, hostProject)
    assert.ok(graph.resolveBinding(resolvedModuleId(affectedFinalId), affectedFinalName))
    assert.ok(
      graph.resolveBinding(resolvedModuleId(unaffectedFinalId), unaffectedFinalName)
    )
    coldSamples.push(performance.now() - start)
  }

  const graph = new ProjectGraph(factory, hostProject)
  assert.ok(graph.resolveBinding(resolvedModuleId(affectedFinalId), affectedFinalName))
  assert.ok(
    graph.resolveBinding(resolvedModuleId(unaffectedFinalId), unaffectedFinalName)
  )
  const expectedAffected = [...project.files.keys()]
    .filter((id) => Number(id.match(/module-(\d+)\.ts$/)?.[1]) < moduleCount / 2)
    .sort()
  const rootId = resolvedModuleId('/generated/module-0.ts')
  const actualAffected = graph.affectedBy(rootId)
  const initialParseCounts = new Map(
    [...project.files.keys()].map((id) => [id, graph.parseCount(resolvedModuleId(id))])
  )
  const rootModule = hostProject.modules.find((module) => module.id === rootId)
  assert.ok(rootModule)
  const warmSamples: number[] = []

  for (let sample = 0; sample < 100; sample++) {
    const nextValue = sample % 2 === 0 ? 2 : 1
    const start = performance.now()
    graph.updateModule({
      ...rootModule,
      source: `export const value0 = ${nextValue}\n`,
    })
    const affected = graph.evaluateBinding(
      resolvedModuleId(affectedFinalId),
      affectedFinalName
    )
    assert.equal(affected.ok, true)
    if (affected.ok) assert.equal(affected.value, nextValue + affectedFinalIndex)
    const unaffected = graph.evaluateBinding(
      resolvedModuleId(unaffectedFinalId),
      unaffectedFinalName
    )
    assert.equal(unaffected.ok, true)
    if (unaffected.ok) {
      assert.equal(unaffected.value, 1 + unaffectedFinalIndex - unaffectedRootIndex)
    }
    warmSamples.push(performance.now() - start)
  }

  const unaffectedReparseCount = [...project.files.keys()]
    .filter((id) => id !== '/generated/module-0.ts')
    .reduce(
      (total, id) =>
        total +
        graph.parseCount(resolvedModuleId(id)) -
        (initialParseCounts.get(id) ?? 0),
      0
    )
  const cold = distribution(coldSamples)
  const warm = distribution(warmSamples)
  const warmToColdRatio = warm.p95Ms / cold.medianMs

  return {
    candidate: factory.name,
    moduleCount,
    cold,
    warm,
    warmToColdRatio,
    unaffectedReparseCount,
    affectedModuleCount: actualAffected.length,
    gates: {
      warmUnder50Ms: warm.p95Ms <= 50,
      warmUnder25PercentCold: warmToColdRatio <= 0.25,
      exactInvalidation:
        JSON.stringify(actualAffected) === JSON.stringify(expectedAffected),
      noUnaffectedReparse: unaffectedReparseCount === 0,
    },
  }
}

export function measureCandidateMemory(
  factory: CandidateFactory,
  moduleCount = 1_000
): MemoryMeasurement {
  const project = createGeneratedProject(moduleCount)
  const hostProject = hostResolvedProjectFromInput(project)
  const finalIndex = moduleCount / 2 - 1
  const finalId = `/generated/module-${finalIndex}.ts`
  const finalName = `value${finalIndex}`

  collectGarbage()
  const before = process.memoryUsage()
  const graph = new ProjectGraph(factory, hostProject)
  assert.ok(graph.resolveBinding(resolvedModuleId(finalId), finalName))
  collectGarbage()
  const after = process.memoryUsage()

  return {
    heapDeltaBytes: Math.max(0, after.heapUsed - before.heapUsed),
    rssDeltaBytes: Math.max(0, after.rss - before.rss),
  }
}
