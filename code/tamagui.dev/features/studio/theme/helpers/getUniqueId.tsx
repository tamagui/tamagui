export function getUniqueId() {
  return Number(new Date()).toString() + Math.floor(Math.random() * 10000000).toString()
}
