import { twMerge } from 'tailwind-merge'

const calls = [
  ['flex-row', 'sm:flex-col'],
  ['sm:flex-col', 'sm:flex-row'],
  ['bg-red-500 sm:bg-blue-500', 'bg-green-500'],
  ['sm:hover:bg-red-500', 'hover:sm:bg-blue-500'],
]

for (const args of calls) {
  console.log(
    `twMerge(${args.map(JSON.stringify).join(', ')}) => ${JSON.stringify(twMerge(...args))}`
  )
}
