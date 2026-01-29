import type React from 'react'
import { useEffect } from 'react'
import { setTintFamily, type TintFamily } from './tints'

// inline script that runs before hydration to set season class on html
// auto-detects season from current date
function getInlineScript() {
  return `(function(){
  var d = new Date();
  var m = d.getMonth();
  var day = d.getDate();
  var season = 'tamagui';

  if (m === 11 && day >= 14) season = 'xmas';
  else if (m === 9 && day >= 20) season = 'halloween';
  else if (m === 2 && day >= 10 && day <= 17) season = 'stpatricks';
  else if (m === 2 && day >= 30 || m === 3 && day <= 20) season = 'easter';
  else if (m === 1 && day >= 7 && day <= 14) season = 'valentine';
  else if (m === 0 && day >= 20 || m === 1 && day <= 12) season = 'lunar';

  if (season !== 'tamagui') {
    document.documentElement.classList.add(season + '-season');
  }
  window.__TAMAGUI_SEASON__ = season;
})();`
}

// syncs the tint family with the value computed by the inline script
function useSeasonSync() {
  useEffect(() => {
    const computed = (window as any).__TAMAGUI_SEASON__ as TintFamily | undefined
    if (computed) {
      setTintFamily(computed)
    }
  }, [])
}

export function SeasonProvider({
  children,
}: { children: React.ReactNode }): React.ReactNode {
  useSeasonSync()

  return (
    <>
      {/* disabled because were launchig v2 and its lunar new year */}
      {/* <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: getInlineScript(),
        }}
      /> */}
      {children}
    </>
  )
}
