import { Slide } from '../Slide'
import { memo } from 'react'

export default memo(() => {
  return (
    <Slide
      title="Themes"
      subTitle="@tamagui/core"
      stepsStrategy="replace"
      theme="pink"
      steps={[
        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: '/talk-images/themes-1.png',
          },

          {
            type: 'text-overlay',
            variant: 'good',
            content: `dark`,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: '/talk-images/themes-2.png',
          },

          {
            type: 'text-overlay',
            variant: 'good',
            content: `light`,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: '/talk-images/themes-1.5.png',
          },

          {
            type: 'text-overlay',
            variant: 'good',
            content: `dark + inverse`,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: '/talk-images/themes-4.png',
          },

          {
            type: 'text-overlay',
            variant: 'good',
            content: `dark_outlined`,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: '/talk-images/themes-3.png',
          },

          {
            type: 'text-overlay',
            variant: 'good',
            content: `light_outlined`,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: '/talk-images/themes-6.png',
          },

          {
            type: 'text-overlay',
            variant: 'good',
            content: `dark_purple`,
          },
        ],

        [
          {
            type: 'image',
            variant: 'centered',
            fullscreen: true,
            image: '/talk-images/themes-7.png',
          },

          {
            type: 'text-overlay',
            variant: 'good',
            content: `dark_purple_alt`,
          },
        ],

        // [
        //   {
        //     type: 'image',
        //     variant: 'centered',
        //     fullscreen: true,
        //     image: '/talk-images/themes-5.png',
        //   },

        //   {
        //     type: 'text-overlay',
        //     variant: 'good',
        //     content: `dark_green_outlined`,
        //   },
        // ],

        // [
        //   {
        //     type: 'content',
        //     content: (
        //       <YStack
        //         my={-100}
        //         als="center"
        //         mx="auto"
        //         ai="center"
        //         br="$4"
        //         ov="hidden"
        //         elevation="$5"
        //       >
        //         <video autoPlay loop style={{ width: 800, height: 800 }}>
        //           <source src="/talk/themes-demo.mp4" />
        //         </video>
        //       </YStack>
        //     ),
        //   },
        // ],

        // [
        //   {
        //     type: 'fullscreen',
        //     content: (
        //       <iframe
        //         width="100%"
        //         height="100%"
        //         src="https://www.youtube.com/embed/FqFLwud5l7g"
        //         title="beatgig-demo"
        //         frameBorder={0}
        //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        //         allowFullScreen
        //       />
        //     ),
        //   },
        // ],
      ]}
    />
  )
})
