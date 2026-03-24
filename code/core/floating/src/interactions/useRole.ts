import * as React from 'react'

import type { ElementProps, FloatingInteractionContext, UseRoleProps } from './types'

type RoleValue = NonNullable<UseRoleProps['role']>

const componentRoleToAriaRoleMap = new Map<RoleValue, RoleValue | false>([
  ['select', 'listbox'],
  ['combobox', 'listbox'],
  ['label', false],
])

let idCounter = 0

// sets ARIA attributes based on role
export function useRole(
  context: FloatingInteractionContext,
  props: UseRoleProps = {}
): ElementProps {
  const { open, elements } = context
  const { enabled = true, role = 'dialog' } = props

  const defaultReferenceId = React.useId()
  const referenceId = elements.domReference?.id || defaultReferenceId

  const defaultFloatingId = React.useMemo(() => `floating-${idCounter++}`, [])
  const floatingId = React.useMemo(
    () => elements.floating?.id || defaultFloatingId,
    [elements.floating, defaultFloatingId]
  )

  const ariaRole = (componentRoleToAriaRoleMap.get(role) ?? role) as
    | 'tooltip'
    | 'dialog'
    | 'alertdialog'
    | 'menu'
    | 'listbox'
    | 'grid'
    | 'tree'
    | false

  const reference: ElementProps['reference'] = React.useMemo(() => {
    if (ariaRole === 'tooltip' || role === 'label') {
      return {
        [`aria-${role === 'label' ? 'labelledby' : 'describedby'}`]: open
          ? floatingId
          : undefined,
      }
    }

    return {
      'aria-expanded': open ? 'true' : 'false',
      'aria-haspopup': ariaRole === 'alertdialog' ? 'dialog' : ariaRole,
      'aria-controls': open ? floatingId : undefined,
      ...(ariaRole === 'listbox' && { role: 'combobox' }),
      ...(ariaRole === 'menu' && { id: referenceId }),
      ...(role === 'select' && { 'aria-autocomplete': 'none' }),
      ...(role === 'combobox' && { 'aria-autocomplete': 'list' }),
    }
  }, [ariaRole, floatingId, open, referenceId, role])

  const floating: ElementProps['floating'] = React.useMemo(() => {
    const floatingProps = {
      id: floatingId,
      ...(ariaRole && { role: ariaRole }),
    }

    if (ariaRole === 'tooltip' || role === 'label') {
      return floatingProps
    }

    return {
      ...floatingProps,
      ...(ariaRole === 'menu' && { 'aria-labelledby': referenceId }),
    }
  }, [ariaRole, floatingId, referenceId, role])

  const item: ElementProps['item'] = React.useCallback(
    ({ active, selected }: { active?: boolean; selected?: boolean }) => {
      const commonProps = {
        role: 'option',
        ...(active && { id: `${floatingId}-fui-option` }),
      }

      switch (role) {
        case 'select':
        case 'combobox':
          return {
            ...commonProps,
            'aria-selected': selected,
          }
      }

      return {}
    },
    [floatingId, role]
  )

  return React.useMemo(
    () => (enabled ? { reference, floating, item } : {}),
    [enabled, reference, floating, item]
  )
}
