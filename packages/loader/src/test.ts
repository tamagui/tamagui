export default async function loader(this: any, sourceIn: Buffer | string) {
  this.cacheable(true)
  const callback = this.async()
  const sourcePath = `${this.resourcePath}`
  // console.log('ye', sourcePath, this.getOptions().isServer)
  return callback(null, sourceIn)
}
