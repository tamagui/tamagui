function FocusGuards(props: any) {
  useFocusGuards()
  return props.children
}

function useFocusGuards() {
  return null
}

const Root = FocusGuards

export {
  FocusGuards,
  //
  Root,
  //
  useFocusGuards,
}
