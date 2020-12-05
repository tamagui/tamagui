import anyTest, { TestInterface } from 'ava'

import { getStylesAtomic } from '../src'

process.env.NODE_ENV = 'test'
process.env.IDENTIFY_TAGS = 'true'

const test = anyTest as TestInterface

test('converts a style object to class names', async (t) => {
  const style = {
    backgroundColor: 'red',
    transform: [{ rotateY: '10deg' }],
    shadowRadius: 10,
    shadowColor: 'red',
    borderBottomWidth: 1,
    borderBottomColor: 'blue',
  }
  const styles = getStylesAtomic(style)
  const style1 = styles.find((x) => x.property === 'backgroundColor')
  const style2 = styles.find((x) => x.property === 'transform')
  const style3 = styles.find((x) => x.property === 'boxShadow')
  t.assert(!!style1)
  t.assert(!!style2)
  t.assert(!!style3)
  t.assert(
    styles.find((x) => x.property === 'borderBottomStyle')?.value === 'solid'
  )
  t.deepEqual(style1!.rules, [
    '.r-backgroundColor-1g6456j{background-color:rgba(255,0,0,1.00);}',
  ])
  t.deepEqual(style2!.rules, [
    '.r-transform-1kwkdns{-webkit-transform:rotateY(10deg);transform:rotateY(10deg);}',
  ])
  t.deepEqual(style3!.rules, [
    '.r-boxShadow-rfqnir{box-shadow:0px 0px 10px rgba(255,0,0,1.00);}',
  ])
})

test('expands and resolves shorthand props', async (t) => {
  const style = {
    padding: 10,
    paddingVertical: 0,
  }
  const [pB, pL, pR, pT] = getStylesAtomic(style)
  t.is(pT.value, '0px')
  t.is(pB.value, '0px')
  t.is(pL.value, '10px')
  t.is(pR.value, '10px')

  const style2 = {
    borderColor: 'yellow',
    borderWidth: 10,
  }
  const styles2 = getStylesAtomic(style2)
  t.assert(styles2.some((x) => x.property === 'borderRightStyle'))
})
