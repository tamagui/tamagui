/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createDOMProps } from '..'

const createProps = (props) => createDOMProps(null, props)

describe('modules/createDOMProps', () => {
  describe('focus-related accessibility attributes', () => {
    test('with no accessibility props', () => {
      expect(createProps({})).toEqual({})
    })

    describe('"accessibilityRole" of "link"', () => {
      const accessibilityRole = 'link'

      test('default case', () => {
        expect(createProps({ accessibilityRole })).toEqual(
          expect.not.objectContaining({ tabIndex: '-1' })
        )
      })

      test('when "tabIndex" is 0', () => {
        expect(createProps({ accessibilityRole, tabIndex: 0 })).toEqual(
          expect.objectContaining({ tabIndex: 0 })
        )
      })

      test('when "tabIndex" is -1', () => {
        expect(createProps({ accessibilityRole, tabIndex: -1 })).toEqual(
          expect.objectContaining({ tabIndex: -1 })
        )
      })

      test('when "accessibilityDisabled" is true', () => {
        expect(createProps({ accessibilityRole, accessibilityDisabled: true })).toEqual(
          expect.objectContaining({ 'aria-disabled': true })
        )
      })

      test('when "disabled" is false', () => {
        expect(createProps({ accessibilityRole, accessibilityDisabled: false })).toEqual(
          expect.not.objectContaining({ tabIndex: '-1' })
        )
      })
    })

    const testFocusableRole = (accessibilityRole) => {
      test('default case', () => {
        expect(createProps({ accessibilityRole })).toEqual(
          expect.objectContaining({ tabIndex: '0' })
        )
      })

      test('when "tabIndex" is -1', () => {
        expect(createProps({ accessibilityRole, tabIndex: -1 })).toEqual(
          expect.objectContaining({ tabIndex: -1 })
        )
      })

      test('when "accessibilityDisabled" is true', () => {
        expect(createProps({ accessibilityRole, accessibilityDisabled: true })).toEqual(
          expect.objectContaining({ 'aria-disabled': true })
        )
      })

      test('when "accessibilityDisabled" is false', () => {
        expect(createProps({ accessibilityRole, accessibilityDisabled: false })).toEqual(
          expect.objectContaining({ tabIndex: '0' })
        )
      })
    }

    describe('"accessibilityRole" of "button"', () => {
      testFocusableRole('button')
    })

    describe('with unfocusable accessibilityRole', () => {
      test('when "tabIndex" is 0', () => {
        expect(createProps({ tabIndex: 0 })).toEqual(
          expect.objectContaining({ tabIndex: 0 })
        )
      })

      test('when "tabIndex" is -1', () => {
        expect(createProps({ tabIndex: -1 })).toEqual(
          expect.objectContaining({ tabIndex: -1 })
        )
      })

      test('strips "focusable"', () => {
        const props = createProps({ focusable: false })

        expect(props).not.toHaveProperty('focusable')
        expect(props).not.toHaveProperty('tabIndex')
      })
    })
  })

  test('prop "accessibilityLabel" becomes "aria-label"', () => {
    const accessibilityLabel = 'accessibilityLabel'
    const props = createProps({ accessibilityLabel })
    expect(props['aria-label']).toEqual(accessibilityLabel)
  })

  test('prop "accessibilityLiveRegion" becomes "aria-live"', () => {
    const accessibilityLiveRegion = 'none'
    const props = createProps({ accessibilityLiveRegion })
    expect(props['aria-live']).toEqual('off')
  })

  test('prop "accessibilityRole" becomes "role"', () => {
    const accessibilityRole = 'button'
    const props = createProps({ accessibilityRole })
    expect(props.role).toEqual('button')
  })

  test('prop "className" is preserved', () => {
    const className = 'external-class-name'
    const props = createProps({ className })
    expect(props.className).toEqual(className)
  })

  test('prop "nativeID" becomes "id"', () => {
    const nativeID = 'Example.nativeID'
    const props = createProps({ nativeID })
    expect(props.id).toEqual(nativeID)
  })

  test('prop "testID" becomes "data-testid"', () => {
    const testID = 'Example.testID'
    const props = createProps({ testID })
    expect(props['data-testid']).toEqual(testID)
  })
})
