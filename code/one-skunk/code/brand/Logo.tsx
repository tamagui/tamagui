import { Image, styled } from 'tamagui'
import oneBallImage from './one-ball.png'

const LogoImage = styled(Image, {
  width: 30,
  height: 30,
})

export function Logo() {
  return <LogoImage src={oneBallImage} />
}
