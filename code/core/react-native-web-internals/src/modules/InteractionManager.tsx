/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { invariant } from './invariant'
import { requestIdleCallback } from './requestIdleCallback/index'

// Simple EventEmitter implementation for internal use
type EventMap = {
  [K in string]: any[]
}

type EventSubscription = {
  remove: () => void
}

class EventEmitter<TEventMap extends EventMap = EventMap> {
  private _registry: {
    [K in keyof TEventMap]?: Set<{
      context: any
      listener: (...args: TEventMap[K]) => void
      remove: () => void
    }>
  } = {}

  addListener<K extends keyof TEventMap>(
    eventType: K,
    listener: (...args: TEventMap[K]) => void,
    context?: any
  ): EventSubscription {
    const registrations = this._allocate(eventType)
    const registration = {
      context,
      listener,
      remove: () => {
        registrations.delete(registration)
      },
    }
    registrations.add(registration)
    return registration
  }

  emit<K extends keyof TEventMap>(eventType: K, ...args: TEventMap[K]): void {
    const registrations = this._registry[eventType]
    if (registrations != null) {
      for (const registration of Array.from(registrations)) {
        registration.listener.apply(registration.context, args)
      }
    }
  }

  private _allocate<K extends keyof TEventMap>(
    eventType: K
  ): Set<{
    context: any
    listener: (...args: TEventMap[K]) => void
    remove: () => void
  }> {
    let registrations = this._registry[eventType]
    if (registrations == null) {
      registrations = new Set()
      this._registry[eventType] = registrations
    }
    return registrations
  }
}

// TaskQueue implementation
type SimpleTask = {
  name: string
  run: () => void
}

type PromiseTask = {
  name: string
  gen: () => Promise<void>
}

export type Task = SimpleTask | PromiseTask | (() => void)

interface QueueItem {
  tasks: Task[]
  popable: boolean
}

class TaskQueue {
  private _queueStack: QueueItem[]
  private _onMoreTasks: () => void

  constructor({ onMoreTasks }: { onMoreTasks: () => void }) {
    this._onMoreTasks = onMoreTasks
    this._queueStack = [{ tasks: [], popable: true }]
  }

  enqueueTasks(tasks: Task[]): void {
    tasks.forEach((task) => this._enqueue(task))
  }

  cancelTasks(tasksToCancel: Task[]): void {
    this._queueStack = this._queueStack
      .map((queue) => ({
        ...queue,
        tasks: queue.tasks.filter((task) => !tasksToCancel.includes(task)),
      }))
      .filter((queue, idx) => queue.tasks.length > 0 || idx === 0)
  }

  hasTasksToProcess(): boolean {
    return this._getCurrentQueue().length > 0
  }

  processNext(): void {
    const queue = this._getCurrentQueue()
    if (queue.length) {
      const task = queue.shift()
      try {
        if (typeof task === 'object' && task && 'gen' in task) {
          this._genPromise(task as PromiseTask)
        } else if (typeof task === 'object' && task && 'run' in task) {
          ;(task as SimpleTask).run()
        } else {
          invariant(
            typeof task === 'function',
            'Expected Function, SimpleTask, or PromiseTask, but got:\n' +
              JSON.stringify(task, null, 2)
          )
          ;(task as () => void)()
        }
      } catch (e) {
        if (e instanceof Error) {
          const taskName =
            task && typeof task === 'object' && 'name' in task ? task.name : ''
          e.message = 'TaskQueue: Error with task ' + taskName + ': ' + e.message
        }
        throw e
      }
    }
  }

  private _enqueue(task: Task): void {
    this._getCurrentQueue().push(task)
  }

  private _getCurrentQueue(): Task[] {
    const stackIdx = this._queueStack.length - 1
    const queue = this._queueStack[stackIdx]
    if (queue.popable && queue.tasks.length === 0 && stackIdx > 0) {
      this._queueStack.pop()
      return this._getCurrentQueue()
    } else {
      return queue.tasks
    }
  }

  private _genPromise(task: PromiseTask) {
    const length = this._queueStack.push({ tasks: [], popable: false })
    const stackIdx = length - 1
    const stackItem = this._queueStack[stackIdx]
    task
      .gen()
      .then(() => {
        stackItem.popable = true
        if (this.hasTasksToProcess()) {
          this._onMoreTasks()
        }
      })
      .catch((ex) => {
        setTimeout(() => {
          if (ex instanceof Error) {
            ex.message = `TaskQueue: Error resolving Promise in task ${task.name}: ${ex.message}`
          }
          throw ex
        }, 0)
      })
  }
}

const _emitter = new EventEmitter<{
  interactionComplete: []
  interactionStart: []
}>()

export const InteractionManager = {
  Events: {
    interactionStart: 'interactionStart' as const,
    interactionComplete: 'interactionComplete' as const,
  },

  /**
   * Schedule a function to run after all interactions have completed.
   */
  runAfterInteractions(task?: Task): {
    then: <TResult1 = void, TResult2 = never>(
      onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
    ) => Promise<TResult1 | TResult2>
    done: <TResult1 = void, TResult2 = never>(
      onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
    ) => Promise<TResult1 | TResult2>
    cancel: () => void
  } {
    const tasks: Array<Task> = []
    const promise = new Promise<void>((resolve) => {
      _scheduleUpdate()
      if (task) {
        tasks.push(task)
      }
      tasks.push({
        run: resolve,
        name:
          'resolve ' +
          ((task && typeof task === 'object' && 'name' in task && task.name) || '?'),
      })
      _taskQueue.enqueueTasks(tasks)
    })
    return {
      then: promise.then.bind(promise),
      done: promise.then.bind(promise),
      cancel: () => {
        _taskQueue.cancelTasks(tasks)
      },
    }
  },

  /**
   * Notify manager that an interaction has started.
   */
  createInteractionHandle(): number {
    _scheduleUpdate()
    const handle = ++_inc
    _addInteractionSet.add(handle)
    return handle
  },

  /**
   * Notify manager that an interaction has completed.
   */
  clearInteractionHandle(handle: number): void {
    invariant(!!handle, 'Must provide a handle to clear.')
    _scheduleUpdate()
    _addInteractionSet.delete(handle)
    _deleteInteractionSet.add(handle)
  },

  addListener: _emitter.addListener.bind(_emitter) as (
    eventType: 'interactionStart' | 'interactionComplete',
    listener: () => void,
    context?: any
  ) => EventSubscription,

  /**
   * Set deadline for task processing
   */
  setDeadline(deadline: number): void {
    _deadline = deadline
  },
}

const _interactionSet = new Set<number>()
const _addInteractionSet = new Set<number>()
const _deleteInteractionSet = new Set<number>()
const _taskQueue = new TaskQueue({ onMoreTasks: _scheduleUpdate })
let _nextUpdateHandle: number | ReturnType<typeof setTimeout> | null = null
let _inc = 0
let _deadline = -1

/**
 * Schedule an asynchronous update to the interaction state.
 */
function _scheduleUpdate(): void {
  if (!_nextUpdateHandle) {
    if (_deadline > 0) {
      _nextUpdateHandle = setTimeout(_processUpdate)
    } else {
      _nextUpdateHandle = requestIdleCallback(_processUpdate)
    }
  }
}

/**
 * Notify listeners, process queue, etc
 */
function _processUpdate(): void {
  _nextUpdateHandle = null
  const interactionCount = _interactionSet.size
  _addInteractionSet.forEach((handle) => _interactionSet.add(handle))
  _deleteInteractionSet.forEach((handle) => _interactionSet.delete(handle))
  const nextInteractionCount = _interactionSet.size

  if (interactionCount !== 0 && nextInteractionCount === 0) {
    _emitter.emit('interactionComplete')
  } else if (interactionCount === 0 && nextInteractionCount !== 0) {
    _emitter.emit('interactionStart')
  }

  if (nextInteractionCount === 0) {
    // It seems that we can't know the running time of the current event loop,
    // we can only calculate the running time of the current task queue.
    const begin = Date.now()
    while (_taskQueue.hasTasksToProcess()) {
      _taskQueue.processNext()
      if (_deadline > 0 && Date.now() - begin >= _deadline) {
        _scheduleUpdate()
        break
      }
    }
  }
  _addInteractionSet.clear()
  _deleteInteractionSet.clear()
}
