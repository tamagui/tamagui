import { URL } from 'url'

import { codeFrameColumns } from '@babel/code-frame'
import type { FastifyLoggerInstance } from 'fastify'
import { SourceMapConsumer } from 'source-map'

import type {
  CodeFrame,
  InputStackFrame,
  ReactNativeStackFrame,
  StackFrame,
  SymbolicatorDelegate,
  SymbolicatorResults,
} from './types'

/**
 * Class for transforming stack traces from React Native application with using Source Map.
 * Raw stack frames produced by React Native, points to some location from the bundle
 * eg `index.bundle?platform=ios:567:1234`. By using Source Map for that bundle `Symbolicator`
 * produces frames that point to source code inside your project eg `Hello.tsx:10:9`.
 */
export class Symbolicator {
  /**
   * Infer platform from stack frames.
   * Usually at least one frame has `file` field with the bundle URL eg:
   * `http://localhost:8081/index.bundle?platform=ios&...`, which can be used to infer platform.
   *
   * @param stack Array of stack frames.
   * @returns Inferred platform or `undefined` if cannot infer.
   */
  static inferPlatformFromStack(stack: ReactNativeStackFrame[]) {
    for (const frame of stack) {
      if (!frame.file) {
        return
      }

      const { searchParams, pathname } = new URL(frame.file, 'file://')
      const platform = searchParams.get('platform')
      if (platform) {
        return platform
      } else {
        const [bundleFilename] = pathname.split('/').reverse()
        const [, platformOrExtension, extension] = bundleFilename.split('.')
        if (extension) {
          return platformOrExtension
        }
      }
    }
  }

  /**
   * Cache with initialized `SourceMapConsumer` to improve symbolication performance.
   */
  sourceMapConsumerCache: Record<string, SourceMapConsumer> = {}

  /**
   * Constructs new `Symbolicator` instance.
   *
   * @param delegate Delegate instance with symbolication functions.
   */
  constructor(private delegate: SymbolicatorDelegate) {}

  /**
   * Process raw React Native stack frames and transform them using Source Maps.
   * Method will try to symbolicate as much data as possible, but if the Source Maps
   * are not available, invalid or the original positions/data is not found in Source Maps,
   * the method will return raw values - the same as supplied with `stack` parameter.
   * For example out of 10 frames, it's possible that only first 7 will be symbolicated and the
   * remaining 3 will be unchanged.
   *
   * @param logger Fastify logger instance.
   * @param stack Raw stack frames.
   * @returns Symbolicated stack frames.
   */
  async process(
    logger: FastifyLoggerInstance,
    stack: ReactNativeStackFrame[]
  ): Promise<SymbolicatorResults> {
    logger.debug({ msg: 'Filtering out unnecessary frames' })

    const frames: InputStackFrame[] = []
    for (const frame of stack) {
      const { file } = frame
      if (file?.startsWith('http') && !file.includes('debuggerWorker')) {
        frames.push(frame as InputStackFrame)
      }
    }

    try {
      logger.debug({ msg: 'Processing frames', frames })

      const processedFrames: StackFrame[] = []
      for (const frame of frames) {
        if (!this.sourceMapConsumerCache[frame.file]) {
          logger.debug({
            msg: 'Loading raw source map data',
            fileUrl: frame.file,
          })

          const rawSourceMap = await this.delegate.getSourceMap(frame.file)

          logger.debug({
            msg: 'Creating source map instance',
            fileUrl: frame.file,
            sourceMapLength: rawSourceMap.length,
          })
          const sourceMapConsumer = await new SourceMapConsumer(rawSourceMap.toString())

          logger.debug({
            msg: 'Saving source map instance into cache',
            fileUrl: frame.file,
          })
          this.sourceMapConsumerCache[frame.file] = sourceMapConsumer
        }

        logger.debug({
          msg: 'Symbolicating frame',
          frame,
        })
        const processedFrame = this.processFrame(frame)

        logger.debug({
          msg: 'Finished symbolicating frame',
          frame,
        })
        processedFrames.push(processedFrame)
      }

      const codeFrame = (await this.getCodeFrame(logger, processedFrames)) ?? null

      logger.debug({
        msg: 'Finished symbolicating frames',
        processedFrames,
        codeFrame,
      })

      return {
        stack: processedFrames,
        codeFrame,
      }
    } finally {
      for (const key in this.sourceMapConsumerCache) {
        this.sourceMapConsumerCache[key].destroy()
        delete this.sourceMapConsumerCache[key]
      }
    }
  }

  private processFrame(frame: InputStackFrame): StackFrame {
    if (!frame.lineNumber || !frame.column) {
      return {
        ...frame,
        collapse: false,
      }
    }

    const consumer = this.sourceMapConsumerCache[frame.file]
    if (!consumer) {
      return {
        ...frame,
        collapse: false,
      }
    }

    const lookup = consumer.originalPositionFor({
      line: frame.lineNumber,
      column: frame.column,
    })

    // If lookup fails, we get the same shape object, but with
    // all values set to null
    if (!lookup.source) {
      // It is better to gracefully return the original frame
      // than to throw an exception
      return {
        ...frame,
        collapse: false,
      }
    }

    return {
      lineNumber: lookup.line || frame.lineNumber,
      column: lookup.column || frame.column,
      file: lookup.source,
      methodName: lookup.name || frame.methodName,
      collapse: false,
    }
  }

  private async getCodeFrame(
    logger: FastifyLoggerInstance,
    processedFrames: StackFrame[]
  ): Promise<CodeFrame | undefined> {
    for (const frame of processedFrames) {
      if (frame.collapse || !frame.lineNumber || !frame.column) {
        continue
      }

      if (!this.delegate.shouldIncludeFrame(frame)) {
        return undefined
      }

      logger.debug({
        msg: 'Generating code frame',
        frame,
      })

      try {
        return {
          content: codeFrameColumns(
            (await this.delegate.getSource(frame.file)).toString(),
            {
              start: { column: frame.column, line: frame.lineNumber },
            },
            { forceColor: true }
          ),
          location: {
            row: frame.lineNumber,
            column: frame.column,
          },
          fileName: frame.file,
        }
      } catch (error) {
        logger.error({
          msg: 'Failed to create code frame',
          error: (error as Error).message,
        })
      }

      return undefined
    }
  }
}
