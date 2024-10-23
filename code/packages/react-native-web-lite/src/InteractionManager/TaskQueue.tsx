import { invariant } from '@tamagui/react-native-web-internals'

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

  enqueue(task: Task): void {
    this._getCurrentQueue().push(task)
  }

  enqueueTasks(tasks: Task[]): void {
    tasks.forEach((task) => this.enqueue(task))
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

  /**
   * Executes the next task in the queue.
   */
  processNext(): void {
    const queue = this._getCurrentQueue()
    if (queue.length) {
      const task = queue.shift()
      try {
        if (typeof task === 'object' && 'gen' in task) {
          this._genPromise(task)
        } else if (typeof task === 'object' && 'run' in task) {
          task.run()
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
          e.message =
            'TaskQueue: Error with task ' + (task?.name || '') + ': ' + e.message
        }
        throw e
      }
    }
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

export default TaskQueue
