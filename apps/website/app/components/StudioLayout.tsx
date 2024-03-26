// import { UserGuard } from 'hooks/useUser'
// import { NextSeo } from 'next-seo'
// import dynamic from 'next/dynamic'
// import { ToastProvider as StudioToastProvider } from 'studio/ToastProvider'
// import { useDidFinishSSR } from 'tamagui'

// import { useOfflineMode } from '../hooks/useOfflineMode'
// import { GithubConnectionGuard, SponsorshipGuard } from './GithubConnectionGuard'

// const StudioLayoutImpl = dynamic(() => import('@protected/studio/layout'), { ssr: false })

// export const StudioLayout = ({ children }: { children: React.ReactNode }) => {
//   const isClient = useDidFinishSSR()
//   const isOffline = useOfflineMode()

//   if (!isClient) {
//     return null
//   }

//   let content = children

//   if (!isOffline) {
//     content = <LoginGuards>{content}</LoginGuards>
//   }

//   return (
//     <StudioToastProvider>
//       <NextSeo title="Studio — Tamagui" />
//       <StudioLayoutImpl>{content}</StudioLayoutImpl>
//     </StudioToastProvider>
//   )
// }

// const LoginGuards = (props: { children: any }) => {
//   return (
//     <UserGuard>
//       <GithubConnectionGuard>
//         <SponsorshipGuard>{props.children}</SponsorshipGuard>
//       </GithubConnectionGuard>
//     </UserGuard>
//   )
// }
