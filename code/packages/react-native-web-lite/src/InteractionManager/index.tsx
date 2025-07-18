/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { invariant } from '@tamagui/react-native-web-internals'
import EventEmitter from '../vendor/react-native/emitter/_EventEmitter'
import type { Task } from './TaskQueue'
import TaskQueue from './TaskQueue'
import requestIdleCallback from '../modules/requestIdleCallback'

type EventSubscription = any

const _emitter = new EventEmitter()

const InteractionManager = {
  Events: {
    interactionStart: 'interactionStart',
    interactionComplete: 'interactionComplete',
  },

  /**
   * Schedule a function to run after all interactions have completed.
   */
  runAfterInteractions(task?: Task): {
    then: Function
    done: Function
    cancel: Function
  } {
    const tasks: Array<Task> = []
    const promise = new Promise<void>((resolve) => {
      _scheduleUpdate()
      if (task) {
        tasks.push(task)
      }
      tasks.push({
        run: resolve,
        name: 'resolve ' + ((task && task.name) || '?'),
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
  clearInteractionHandle(handle: number) {
    invariant(!!handle, 'Must provide a handle to clear.')
    _scheduleUpdate()
    _addInteractionSet.delete(handle)
    _deleteInteractionSet.add(handle)
  },

  addListener: _emitter.addListener.bind(_emitter) as (
    ...args: Parameters<typeof _emitter.addListener>
  ) => EventSubscription,

  /**
   *
   * @param deadline
   */
  setDeadline(deadline: number) {
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
function _scheduleUpdate() {
  if (!_nextUpdateHandle) {
    if (_deadline > 0) {
      _nextUpdateHandle = setTimeout(_processUpdate)
    } else {
      _nextUpdateHandle = requestIdleCallback(_processUpdate)
    }
  }
}

/**
 * Notify listeners, process queue, etc.
 */
function _processUpdate() {
  _nextUpdateHandle = null
  const interactionCount = _interactionSet.size
  _addInteractionSet.forEach((handle) => _interactionSet.add(handle))
  _deleteInteractionSet.forEach((handle) => _interactionSet.delete(handle))
  const nextInteractionCount = _interactionSet.size

  if (interactionCount !== 0 && nextInteractionCount === 0) {
    _emitter.emit(InteractionManager.Events.interactionComplete)
  } else if (interactionCount === 0 && nextInteractionCount !== 0) {
    _emitter.emit(InteractionManager.Events.interactionStart)
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

export default InteractionManager
