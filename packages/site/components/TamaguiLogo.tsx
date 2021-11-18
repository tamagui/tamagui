import React from 'react'
import { XStack, YStack } from 'tamagui'

export const TamaguiLogo = ({ showWords }: { showWords?: boolean }) => (
  <XStack ai="center" jc="center" space="$5">
    <LogoIcon downscale={showWords ? 2 : 1.5} />
    {showWords && (
      <YStack mb={-4}>
        <LogoWords downscale={2} />
      </YStack>
    )}
  </XStack>
)

export const LogoWords = ({ downscale = 1 }: { downscale?: number }) => {
  // return (
  //   // if you want to inverse the text color
  //   // <YStack backgroundColor="$color">
  //   // <img className="crisp-edges" style={{ width: 206 / downscale, margin: -2 }} src={icon.src} />
  // )
  return (
    <YStack scale={0.75} $gtMd={{ scale: 1 }}>
      <svg width={373 / 3} height={41 / 3} viewBox="0 0 373 41">
        <g stroke="none">
          <g transform="translate(-435.000000, -239.000000)">
            <g transform="translate(435.000000, 239.000000)">
              <polygon
                fill="var(--red10)"
                points="372.677419 40.1612903 372.677419 0.806451613 356.935484 0.806451613 356.935484 40.1612903"
              ></polygon>
              <polygon
                fill="var(--orange10)"
                points="323.483871 40.1612903 323.483871 32.2903226 331.354839 32.2903226 331.354839 0.806451613 315.612903 0.806451613 315.612903 32.2903226 307.741935 32.2903226 307.741935 0.806451613 292 0.806451613 292 32.2903226 299.870968 32.2903226 299.870968 40.1612903"
              ></polygon>
              <polygon
                fill="var(--yellow10)"
                points="264.451613 40.1612903 264.451613 32.2903226 272.322581 32.2903226 272.322581 16.5483871 256.580645 16.5483871 256.580645 32.2903226 248.709677 32.2903226 248.709677 8.67741935 272.322581 8.67741935 272.322581 0.806451613 240.83871 0.806451613 240.83871 8.67741935 232.967742 8.67741935 232.967742 32.2903226 240.83871 32.2903226 240.83871 40.1612903"
              ></polygon>
              <path
                fill="var(--green10)"
                d="M205.419355,0.806451613 L205.419355,8.67741935 L213.290323,8.67741935 L213.290323,40.1612903 L197.548387,40.1612903 L197.548387,24.4193548 L189.677419,24.4193548 L189.677419,40.1612903 L173.935484,40.1612903 L173.935484,8.67741935 L181.806452,8.67741935 L181.806452,0.806451613 L205.419355,0.806451613 Z M197.548387,8.67741935 L189.677419,8.67741935 L189.677419,16.5483871 L197.548387,16.5483871 L197.548387,8.67741935 Z"
                id="Path-10"
                fillRule="nonzero"
              ></path>
              <polygon
                fill="var(--blue10)"
                points="130.645161 40.1612903 130.645161 22.4516129 138.516129 22.4516129 138.516129 40.1612903 154.258065 40.1612903 154.258065 0.806451613 142.451613 0.806451613 142.451613 8.67741935 126.709677 8.67741935 126.709677 0.806451613 114.903226 0.806451613 114.903226 40.1612903"
              ></polygon>
              <path
                fill="var(--violet10)"
                d="M87.3548387,0.806451613 L87.3548387,8.67741935 L95.2258065,8.67741935 L95.2258065,40.1612903 L79.483871,40.1612903 L79.483871,24.4193548 L71.6129032,24.4193548 L71.6129032,40.1612903 L55.8709677,40.1612903 L55.8709677,8.67741935 L63.7419355,8.67741935 L63.7419355,0.806451613 L87.3548387,0.806451613 Z M79.483871,8.67741935 L71.6129032,8.67741935 L71.6129032,16.5483871 L79.483871,16.5483871 L79.483871,8.67741935 Z"
                fillRule="nonzero"
              ></path>
              <polygon
                fill="var(--pink10)"
                points="24.3870968 40.1612903 24.3870968 8.67741935 32.2580645 8.67741935 32.2580645 0.806451613 0.774193548 0.806451613 0.774193548 8.67741935 8.64516129 8.67741935 8.64516129 40.1612903"
              ></polygon>
            </g>
          </g>
        </g>
      </svg>
    </YStack>
  )
}

export const LogoIcon = ({ downscale = 2 }: any) => {
  return (
    <YStack
      marginVertical={-10}
      pressStyle={{
        opacity: 0.7,
      }}
    >
      <svg
        width={450 / 8 / downscale}
        height={420 / 8 / downscale}
        viewBox="0 0 450 420"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-150.000000, -210.000000)">
            <g transform="translate(150.000000, 210.000000)">
              <g transform="translate(30.000000, 30.000000)" fill="var(--color)">
                {/* <path d="M300,0 L300,30 L364,30 L364,60 L420,60 L420,150 L364,150 L364,180 L300,180 L300,300 L270,300 L270,360 L60,360 L60,300 L0,300 L0,60 L60,60 L60,0 L300,0 Z"></path> */}
              </g>
              <g
                transform="translate(225.000000, 210.000000) scale(-1, 1) translate(-225.000000, -210.000000) "
                fill="var(--color)"
              >
                <g>
                  <rect fill="var(--red10)" x="150" y="0" width="20" height="20"></rect>
                  <rect fill="var(--red10)" x="180" y="0" width="20" height="20"></rect>
                  <rect fill="var(--pink10)" x="210" y="0" width="20" height="20"></rect>
                  <rect fill="var(--pink10)" x="240" y="0" width="20" height="20"></rect>
                  <rect fill="var(--pink10)" x="270" y="0" width="20" height="20"></rect>
                  <rect fill="var(--pink10)" x="300" y="0" width="20" height="20"></rect>
                  <rect fill="var(--pink10)" x="330" y="30" width="20" height="20"></rect>
                  <rect fill="var(--pink10)" x="360" y="60" width="20" height="20"></rect>
                  <rect fill="var(--pink10)" x="390" y="90" width="20" height="20"></rect>
                  <rect fill="var(--pink10)" x="390" y="120" width="20" height="20"></rect>
                  <rect fill="var(--purple10)" x="390" y="150" width="20" height="20"></rect>
                  <rect fill="var(--purple10)" x="390" y="180" width="20" height="20"></rect>
                  <rect fill="var(--purple10)" x="420" y="210" width="20" height="20"></rect>
                  <rect fill="var(--purple10)" x="420" y="240" width="20" height="20"></rect>
                  <rect fill="var(--purple10)" x="420" y="270" width="20" height="20"></rect>
                  <rect fill="var(--purple10)" x="390" y="300" width="20" height="20"></rect>
                  <rect fill="var(--purple10)" x="360" y="330" width="20" height="20"></rect>
                  <rect fill="var(--purple10)" x="330" y="360" width="20" height="20"></rect>
                  <rect fill="var(--blue10)" x="300" y="390" width="20" height="20"></rect>
                  <rect fill="var(--blue10)" x="270" y="390" width="20" height="20"></rect>
                  <rect fill="var(--blue10)" x="240" y="360" width="20" height="20"></rect>
                  <rect fill="var(--blue10)" x="210" y="360" width="20" height="20"></rect>
                  <rect fill="var(--blue10)" x="210" y="390" width="20" height="20"></rect>
                  <rect fill="var(--blue10)" x="180" y="390" width="20" height="20"></rect>
                  <rect fill="var(--blue10)" x="150" y="360" width="20" height="20"></rect>
                  <rect fill="var(--blue10)" x="150" y="330" width="20" height="20"></rect>
                  <rect fill="var(--green10)" x="120" y="300" width="20" height="20"></rect>
                  <rect fill="var(--green10)" x="90" y="240" width="20" height="20"></rect>
                  <rect fill="var(--green10)" x="90" y="270" width="20" height="20"></rect>
                  <rect fill="var(--green10)" x="90" y="210" width="20" height="20"></rect>
                  <rect fill="var(--green10)" x="60" y="180" width="20" height="20"></rect>
                  <rect fill="var(--green10)" x="30" y="180" width="20" height="20"></rect>
                  <rect fill="var(--yellow10)" x="0" y="150" width="20" height="20"></rect>
                  <rect fill="var(--yellow10)" x="30" y="120" width="20" height="20"></rect>
                  <rect fill="var(--yellow10)" x="60" y="120" width="20" height="20"></rect>
                  <rect fill="var(--yellow10)" x="90" y="120" width="20" height="20"></rect>
                  <rect fill="var(--yellow10)" x="0" y="90" width="20" height="20"></rect>
                  <rect fill="var(--yellow10)" x="0" y="120" width="20" height="20"></rect>
                  <rect fill="var(--yellow10)" x="30" y="60" width="20" height="20"></rect>
                  <rect fill="var(--red10)" x="30" y="60" width="20" height="20"></rect>
                  <rect fill="var(--red10)" x="60" y="60" width="20" height="20"></rect>
                  <rect fill="var(--red10)" x="120" y="30" width="20" height="20"></rect>
                  <rect x="150" y="60" width="20" height="20"></rect>
                  <rect x="240" y="90" width="20" height="20"></rect>
                  <rect x="240" y="210" width="20" height="20"></rect>
                  <rect x="240" y="240" width="20" height="20"></rect>
                  <rect x="270" y="270" width="20" height="20"></rect>
                  <rect x="300" y="240" width="20" height="20"></rect>
                  <rect x="300" y="210" width="20" height="20"></rect>
                  <rect fill="var(--red10)" x="90" y="60" width="20" height="20"></rect>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </YStack>
  )
}
