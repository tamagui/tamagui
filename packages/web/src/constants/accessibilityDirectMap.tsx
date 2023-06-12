// web only maps accessibility to aria props
export const accessibilityDirectMap: Record<string, string> = {}

if (process.env.TAMAGUI_TARGET === 'web') {
  // bundle size shave
  const items = {
    Hidden: true,
    ActiveDescendant: true,
    Atomic: true,
    AutoComplete: true,
    Busy: true,
    Checked: true,
    ColumnCount: 'colcount',
    ColumnIndex: 'colindex',
    ColumnSpan: 'colspan',
    Current: true,
    Details: true,
    ErrorMessage: true,
    Expanded: true,
    HasPopup: true,
    Invalid: true,
    Label: true,
    Level: true,
    Modal: true,
    Multiline: true,
    MultiSelectable: true,
    Orientation: true,
    Owns: true,
    Placeholder: true,
    PosInSet: true,
    Pressed: true,
    RoleDescription: true,
    RowCount: true,
    RowIndex: true,
    RowSpan: true,
    Selected: true,
    SetSize: true,
    Sort: true,
    ValueMax: true,
    ValueMin: true,
    ValueNow: true,
    ValueText: true,
  }
  for (const key in items) {
    let val = items[key]
    if (val === true) {
      val = key.toLowerCase()
    }
    accessibilityDirectMap[`accessibility${key}`] = `aria-${val}`
  }
}

export const webToNativeAccessibilityDirectMap = null as unknown as Record<string, string>
export const nativeAccessibilityValue = null as unknown as Record<string, string>

export const nativeAccessibilityState = null as unknown as Record<string, string>
export const accessibilityWebRoleToNativeRole = null as unknown as Record<string, string>
