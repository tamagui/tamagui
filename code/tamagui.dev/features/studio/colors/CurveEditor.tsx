// 'use client'

// import { guard, readableColor } from 'color2k'
// import { scaleLinear } from 'd3-scale'
// import React, { useState } from 'react'
// import { DraggableCore } from 'react-draggable'
// import { YStack } from 'tamagui'

// function round(num: number, step: number) {
//   return Math.round(num * (1 / step)) / (1 / step)
// }

// type CurveEditorProps = {
//   values: readonly number[]
//   min: number
//   max: number
//   step?: number
//   onChange?: (values: number[], shiftKey: boolean, index?: number) => void
//   onFocus?: (index: number) => void
//   onBlur?: () => void
//   disabled?: boolean
//   label?: string
//   style?: React.SVGAttributes<SVGSVGElement>['style']
//   labelColor?: string
// }

// // TODO: arrow key support
// // TODO: snap to guides
// // TODO: focus status
// // TODO: label
// export function CurveEditor({
//   values,
//   min,
//   max,
//   onChange,
//   onFocus,
//   onBlur,
//   step = 0.1,
//   disabled = false,
//   label = '',
//   labelColor,
//   style = {},
// }: CurveEditorProps) {
//   // const [{ values }, onChange] = useControllableState<{
//   //   values: readonly number[]
//   //   shiftKey?: boolean
//   //   index?: number
//   // }>({
//   //   defaultProp: { values: valuesProp },
//   //   prop: { values: valuesProp },
//   //   onChange: (values) => onChangeProp?.(values.values, values.shiftKey, values.index),
//   // })
//   const [{ width, height }, setLayout] = useState({ width: 0, height: 0 })
//   const nodeRadius = 20
//   const columnWidth = width / values.length
//   const [dragging, setDragging] = React.useState<number | 'line' | false>(false)
//   const [focused, setFocused] = React.useState<number | 'line' | false>(false)

//   const xScale = React.useCallback(
//     scaleLinear()
//       .domain([0, values.length - 1])
//       .range([columnWidth / 2, width - columnWidth / 2]),
//     [values.length, width, columnWidth]
//   )

//   const yScale = React.useCallback(
//     scaleLinear()
//       .domain([min, max])
//       .range([height - nodeRadius, nodeRadius]),
//     [min, max, height, nodeRadius]
//   )

//   const points = React.useMemo(
//     () => values.map((value, index) => ({ x: xScale(index), y: yScale(value) })),
//     [values, xScale, yScale]
//   )

//   return (
//     <YStack
//       width="100%"
//       height="100%"
//       opacity={disabled ? 0.5 : 1}
//       pos="relative"
//       pointerEvents="none"
//       onLayout={(e) => setLayout(e.nativeEvent.layout)}
//       zi={100}
//     >
//       <svg
//         width="100%"
//         height="100%"
//         fill="none"
//         onKeyDown={(event) => {
//           let delta: number | undefined
//           switch (event.key) {
//             case 'ArrowUp':
//               delta = 1
//               break
//             case 'ArrowDown':
//               delta = -1
//               break
//           }

//           if (delta) {
//             if (focused === 'line') {
//               const clampedDelta = values.reduce((acc, value) => {
//                 if (value + acc < min) {
//                   return min - value
//                 }

//                 if (value + acc > max) {
//                   return max - value
//                 }

//                 return acc
//               }, delta)

//               onChange?.(
//                 values.map((value) => round(value + clampedDelta, step)),
//                 event.shiftKey
//               )
//             } else if (typeof focused === 'number') {
//               const next = [...values]
//               const value = guard(
//                 min,
//                 max,
//                 yScale.invert(points[focused].y) + (delta || 0)
//               )
//               next[focused] = round(value, step)
//               onChange?.(next, event.shiftKey, focused)
//             }
//           }
//         }}
//       >
//         <DraggableCore
//           disabled={disabled}
//           onStart={() => setDragging('line')}
//           onStop={() => setDragging(false)}
//           onDrag={(event, data) => {
//             const delta =
//               yScale.invert(points[0].y + data.deltaY) - yScale.invert(points[0].y)

//             const clampedDelta = values.reduce((acc, value) => {
//               if (value + acc < min) {
//                 return min - value
//               }

//               if (value + acc > max) {
//                 return max - value
//               }

//               return acc
//             }, delta)

//             onChange?.(
//               values.map((value) => round(value + clampedDelta, step)),
//               event.shiftKey
//             )
//           }}
//         >
//           <g
//             pointerEvents={
//               disabled || (dragging !== false && dragging !== 'line') ? 'none' : 'all'
//             }
//             className="c-target-parent"
//             data-dragging={dragging === 'line' ? 'true' : 'false'}
//             onFocus={() => {
//               setFocused('line')
//             }}
//             onBlur={() => {
//               setFocused(false)
//             }}
//             tabIndex={disabled ? undefined : 0}
//           >
//             <polyline
//               className="target"
//               stroke="rgba(0,0,0,0.1)"
//               strokeWidth={nodeRadius * 2}
//               points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
//               strokeLinejoin="round"
//               strokeLinecap="round"
//             />
//             {!disabled ? (
//               <>
//                 <polyline
//                   stroke="var(--background)"
//                   strokeWidth={focused === 'line' ? 6 : 4}
//                   points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
//                   strokeLinejoin="round"
//                   opacity={focused === 'line' ? 1 : 0.5}
//                 />
//                 {focused === 'line' ? (
//                   <polyline
//                     className="line-focus-ring"
//                     points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
//                     strokeLinejoin="round"
//                     fill="none"
//                     style={{
//                       stroke: `var(--color9)`,
//                     }}
//                     strokeWidth="1.5"
//                   />
//                 ) : null}
//               </>
//             ) : (
//               <polyline
//                 stroke="var(--background)"
//                 strokeWidth={2}
//                 points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
//                 strokeLinejoin="round"
//               />
//             )}
//           </g>
//         </DraggableCore>

//         {points.map(({ x, y }, index) => (
//           <DraggableCore
//             key={index}
//             disabled={disabled}
//             onStart={() => setDragging(index)}
//             onStop={() => setDragging(false)}
//             onDrag={(event, data) => {
//               const next = [...values]
//               const value = guard(min, max, yScale.invert(y + data.deltaY))
//               next[index] = round(value, step)
//               onChange?.(next, event.shiftKey, index)
//             }}
//           >
//             <g
//               pointerEvents={disabled ? 'none' : 'all'}
//               className="c-target-parent"
//               data-dragging={dragging === 'line' ? 'true' : 'false'}
//               onFocus={() => {
//                 setFocused(index)
//                 onFocus?.(index)
//               }}
//               onBlur={() => {
//                 setFocused(false)
//                 onBlur?.()
//               }}
//               tabIndex={disabled ? undefined : 0}
//             >
//               <circle
//                 className="target"
//                 cx={x}
//                 cy={y}
//                 r={nodeRadius}
//                 fill="rgba(0,0,0,0.1)"
//                 style={{ transformOrigin: `${x}px ${y}px` }}
//               />
//               {!disabled ? (
//                 <>
//                   <circle
//                     className="border"
//                     cx={x}
//                     cy={y}
//                     r={focused === index || focused === 'line' ? 10.5 : 8.5}
//                     fill="none"
//                     stroke="rgba(0,0,0,0.2)"
//                     strokeWidth="1"
//                   />
//                   <circle
//                     className="handle"
//                     cx={x}
//                     cy={y}
//                     r={focused === index || focused === 'line' ? 10 : 8}
//                     fill="var(--background)"
//                   />
//                   {focused === index || focused === 'line' ? (
//                     <circle
//                       className="focus-ring"
//                       cx={x}
//                       cy={y}
//                       r={7}
//                       fill="none"
//                       style={{
//                         stroke: `var(--color9)`,
//                       }}
//                       strokeWidth="1.5"
//                     />
//                   ) : null}
//                 </>
//               ) : (
//                 <circle
//                   className="node-handle"
//                   cx={x}
//                   cy={y}
//                   r={4}
//                   fill="var(--background)"
//                 />
//               )}

//               {index === 0 ? (
//                 <text
//                   x={x - nodeRadius - 4}
//                   y={y}
//                   fill={labelColor ?? 'var(--background)'}
//                   style={{
//                     textTransform: 'uppercase',
//                     fontFamily: 'system-ui, sans-serif',
//                     fontSize: 14,
//                     lineHeight: 1,
//                   }}
//                   textAnchor="start"
//                   alignmentBaseline="middle"
//                 >
//                   {label}
//                 </text>
//               ) : null}
//             </g>
//           </DraggableCore>
//         ))}
//       </svg>
//     </YStack>
//   )
// }
