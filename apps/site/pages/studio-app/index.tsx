export default function Page() {
  return null
}

// import { getStudioLayout } from '@lib/getStudioLayout'
// import AnimationsPage from '@protected/studio/(loaded)/(sponsor-protected)/animations/page'
// import ColorsPage from '@protected/studio/(loaded)/(sponsor-protected)/colors/page'
// import ConfigPage from '@protected/studio/(loaded)/(sponsor-protected)/config/page'
// import { PreviewPage } from '@protected/studio/(loaded)/(sponsor-protected)/preview/page'
// import ThemesPage from '@protected/studio/(loaded)/(sponsor-protected)/themes/page'
// import TokensPage from '@protected/studio/(loaded)/(sponsor-protected)/tokens/page'
// import LoadPage from '@protected/studio/load/page'
// import { rootStore } from '@protected/studio/state/RootStore'
// import { themesStore } from '@protected/studio/state/ThemesStore'
// import { Tab } from '@protected/studio/state/types'
// import { useSelector } from '@tamagui/use-store'
// import { useRouter } from 'next/router'
// import React, { Suspense, memo, useEffect, useMemo, useState, useTransition } from 'react'
// import { isLocal } from 'studio/constants'
// import { YStack, useDidFinishSSR, useIsomorphicLayoutEffect, useThemeName } from 'tamagui'

// export default function Page() {
//   const hydrated = useDidFinishSSR()

//   const fsReadSucceeded = useSelector(() => rootStore.fsReadSucceeded)

//   // disable ssr
//   if (!hydrated) {
//     return null
//   }

//   return <>{!fsReadSucceeded && !isLocal ? <LoadPage /> : <StudioContents />}</>
// }

// function StudioContents() {
//   // init state
//   useStudioInitialize()

//   return useMemo(() => {
//     return (
//       <>
//         <StudioTab isHome at="view" Page={PreviewPage} />
//         <StudioTab at="config" Page={ConfigPage} />
//         <StudioTab at="colors" Page={ColorsPage} />
//         <StudioTab at="animations" Page={AnimationsPage} />
//         <StudioTab at="themes" Page={ThemesPage} />
//         <StudioTab at="tokens" Page={TokensPage} />
//       </>
//     )
//   }, [])
// }

// function useStudioInitialize() {
//   useSyncTabToCurrentPaneState()
//   useSyncThemeToThemeState()
// }

// function useSyncThemeToThemeState() {
//   const themeName = useThemeName()

//   useIsomorphicLayoutEffect(() => {
//     themesStore.toggleFocusedThemeItem({
//       id: themeName,
//     })
//   }, [themeName])
// }

// function useSyncTabToCurrentPaneState() {
//   const router = useRouter()
//   const tab = router.query.tab

//   useEffect(() => {
//     rootStore.currentPane = (`${tab || ''}` || 'view') as Tab
//   }, [tab])
// }

// Page.getLayout = getStudioLayout

// const StudioTab = memo(
//   ({
//     at,
//     Page,
//     isHome,
//   }: {
//     at: string
//     Page: React.FunctionComponent
//     isHome?: boolean
//   }) => {
//     const router = useRouter()
//     const tab = router.query.tab
//     const isActive = tab === at || (!tab && isHome)
//     const [isPending, startTransition] = useTransition()
//     const [isMounted, setIsMounted] = useState(isActive)

//     useEffect(() => {
//       startTransition(() => {
//         setIsMounted(isActive)
//       })
//     }, [isActive])

//     const childrenMemo = useMemo(() => <Page />, [Page])

//     if (!isMounted) {
//       return null
//     }

//     return (
//       <Suspense fallback={null}>
//         <YStack
//           style={{
//             position: 'absolute',
//             // @ts-ignore
//             inset: 0,
//             opacity: 0,
//             pointerEvents: 'none',
//             ...(isActive && {
//               opacity: 1,
//               pointerEvents: 'auto',
//             }),
//           }}
//         >
//           {childrenMemo}
//         </YStack>
//       </Suspense>
//     )
//   }
// )

// // export const getServerSideProps: GetServerSideProps = async (ctx) => {

// //   // Create authenticated Supabase Client
// //   const supabase = createServerSupabaseClient(ctx)
// //   // Check if we have a session
// //   const {
// //     data: { session },
// //   } = await supabase.auth.getSession()

// //   if (!session)
// //     return {
// //       redirect: {
// //         destination: `${siteRootDir}/login`,
// //         permanent: false,
// //       },
// //     }

// //   return {
// //     props: {
// //       initialSession: session,
// //       user: session.user,
// //     },
// //   }
// // }
