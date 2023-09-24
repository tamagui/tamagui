export const range = (n: number, stop?: number, step?: number) => {
  step ??= 1
  ;[stop, n] = stop === undefined ? [0, n] : [n, stop]
  if (stop > n) n += 2
  return [...Array(~~((n - stop - 1) / step) + 1).keys()].map(
    (n) => stop! + n * step!
  )
}

// inclusive range
export const irange = (n: number, stop?: number, step?: number) => {
  step ??= 1
  ;[stop, n] = stop === undefined ? [0, n] : [n, stop]
  return [...Array(~~((n - stop) / step) + 1).keys()].map(
    (n) => stop! + n * step!
  )
}

// random number between two values
export const getRandomNum = (n: number, stop?: number) => {
  const [min, max] = stop === undefined ? [0, n] : [n, stop]
  return Math.random() * (max - min) + min
}

// random integer between two values inclusive
export const getRandomInt = (n: number, stop?: number) => {
  const [min, max] =
    stop === undefined ? [0, Math.floor(n)] : [Math.ceil(n), Math.floor(stop)]

  return Math.floor(Math.random() * (max - min + 1) + min)
}
