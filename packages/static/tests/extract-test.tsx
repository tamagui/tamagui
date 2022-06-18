process.env.NODE_ENV = 'test'
process.env.IDENTIFY_TAGS = 'true'
process.env.TAMAGUI_TARGET = 'web'
process.env.IS_STATIC = ''

const { getStylesAtomic } = require('@tamagui/core-node')

describe('extract-tests', () => {
  test('converts a style object to class names', () => {
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
    expect(!!style1).toBeTruthy()
    expect(!!style2).toBeTruthy()
    expect(!!style3).toBeTruthy()
    expect(styles.find((x) => x.property === 'borderBottomStyle')?.value === 'solid').toBeTruthy()
    expect(style1!.rules[0].includes('background-color:rgba(255,0,0,1.00)')).toBeTruthy()
    expect(style2!.rules[0].includes(`transform:rotateY(10deg)`)).toBeTruthy()
    expect(style3!.rules[0].includes(`box-shadow:0px 0px 10px rgba(255,0,0,1.00)`)).toBeTruthy()
  })

  test('expands and resolves shorthand props', () => {
    const style = {
      padding: 10,
      paddingVertical: 0,
    }
    const [pT, pR, pB, pL] = getStylesAtomic(style)
    expect(pT.value).toBe('0px')
    expect(pB.value).toBe('0px')
    expect(pL.value).toBe('10px')
    expect(pR.value).toBe('10px')
    const style2 = {
      borderColor: 'yellow',
      borderWidth: 10,
    }
    const styles2 = getStylesAtomic(style2)
    expect(styles2.some((x) => x.property === 'borderRightStyle')).toBeTruthy()
  })
})
