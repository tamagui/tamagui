// to extend for prop types.
// kept out of index.ts so the barrel is pure re-exports: a barrel that declares
// something has to be initialized, which makes every store consumer pull in
// whichever chunk the bundler put the barrel in.
export class Store<Props extends Record<string, any>> {
  constructor(public props: Props) {}
}
