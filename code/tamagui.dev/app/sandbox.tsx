import { Circle, styled } from 'tamagui'

export default function Sandbox() {
  return <AcceptsClassNameThing />
}

const Thing = (props) => <div {...props} />

const AcceptsClassNameThing = styled(
  Thing,
  {
    bg: 'red',
    debug: 'verbose',
    width: 200,
    height: 200,
  },
  {
    acceptsClassName: true,
  }
)

console.log('wtf', AcceptsClassNameThing.staticConfig)
