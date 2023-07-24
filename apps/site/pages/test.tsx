// debug
import { H1 } from 'tamagui'

// export default () => <Square size={100} animation="quick" bc="$background" />
export default () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      flex: 1,
    }}
  >
    <H1
      ta="left"
      size="$10"
      maw={500}
      h={130}
      // FOR CLS IMPORTANT TO SET EXACT HEIGHT IDK WHY LINE HEIGHT SHOULD BE STABLE
      $gtSm={{
        mx: 0,
        maxWidth: 800,
        size: '$13',
        h: 190,
        ta: 'center',
        als: 'center',
      }}
      $gtMd={{
        maxWidth: 900,
        size: '$14',
        h: 240,
      }}
      $gtLg={{
        size: '$16',
        lh: '$15',
        maxWidth: 1200,
        h: 290,
      }}
    >
      <span className="all ease-in ms250 rainbow clip-text">Write less,</span>
      <br />
      runs&nbsp;faster
    </H1>
  </div>
)
