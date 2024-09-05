export default async function loader(this: any, sourceIn: Buffer | string) {
  this.cacheable(true)
  const callback = this.async()
  const sourcePath = `${this.resourcePath}`

  return callback(null, sourceIn)
}
