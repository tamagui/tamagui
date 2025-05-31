import * as t from '@babel/types'

// TODO: open a PR upstream
declare module '@babel/types' {
  export function toIdentifier(input: string): string
}

// A clone of path.scope.generateUid that doesn't prepend underscores
export function generateUid(scope: any, name: string): string {
  if (!(typeof scope === 'object'))
    throw 'generateUid expects a scope object as its first parameter'
  if (!(typeof name === 'string' && name !== ''))
    throw 'generateUid expects a valid name as its second parameter'

  name = t
    .toIdentifier(name)
    .replace(/^_+/, '')
    .replace(/[0-9]+$/g, '')

  let uid
  let i = 0
  do {
    if (i > 1) {
      uid = name + i
    } else {
      uid = name
    }
    i++
  } while (
    scope.hasLabel(uid) ||
    scope.hasBinding(uid) ||
    scope.hasGlobal(uid) ||
    scope.hasReference(uid)
  )

  const program = scope.getProgramParent()
  program.references[uid] = true
  program.uids[uid] = true

  return uid
}
