import { ChangedThemeResponse } from '../hooks/useTheme.js'
import { ThemeProps } from '../types.js'

export function ThemeDebug({
  themeState,
  themeProps,
  children,
  onChangeCount,
}: {
  themeState: ChangedThemeResponse
  themeProps: ThemeProps
  onChangeCount?: number
  children: any
}) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        style={{
          whiteSpace: 'pre',
          background: 'var(--background)',
          display: 'inline-block',
          border: '1px solid #ccc',
          margin: 20,
          color: 'red',
        }}
      >
        <code>
          &lt;Theme /&gt;&nbsp;
          {JSON.stringify(
            {
              name: themeState.name,
              className: themeState.className,
              inverse: themeProps.inverse,
              forceClassName: themeProps.forceClassName,
              parent: themeState.themeManager?.state.parentName,
              id: themeState.themeManager?.id,
              parentId: themeState.themeManager?.parentManager?.id,
              isNew: themeState.isNewTheme,
              onChangeCount,
            },
            null,
            2
          )}
        </code>
        {children}
      </div>
    )
  }
  return children
}
