import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from '@tamagui/lucide-icons'
import {
  Adapt,
  Button,
  Input,
  Label,
  Popper,
  PopperAnchor,
  PopperArrow,
  PopperContent,
  PopperProps,
  Portal,
  PortalHost,
  PortalItem,
  XGroup,
  XStack,
  YGroup,
} from 'tamagui'

export function PopperDemo() {
  return (


      <XStack space="$2" f={1} justifyContent='center' alignItems='center'>
        <Demo placement="left-end" Icon={ChevronLeft} Id="left" />
        <Demo placement="bottom-end" Icon={ChevronDown} Id="bottom" />
        <Demo placement="top-end" Icon={ChevronUp} Id="top" />
        <Demo placement="right-end" Icon={ChevronRight} Id="right" />
      </XStack>

  )
}

export function Demo({ Icon, Id, ...props }: PopperProps & { Icon?: any, Id?: string }) {
  return (
    
    <Popper placement={props.placement}>
      <PopperAnchor>
        <Button icon={Icon} />
      </PopperAnchor>

      <Portal>
        <PopperContent>
            <PopperArrow bw={1} boc="$borderColor" />

            <YGroup space="$3" width={200} bw={1} boc="$borderColor">
              <XStack space="$3">
                <Label size="$3" htmlFor={Id}>
                  Name
                </Label>
                <Input size="$3" id={Id} />
              </XStack>
              
                <Button
                  size="$3"
                >
                  Submit
                </Button>
            </YGroup>

          </PopperContent>
        </Portal>


    </Popper>

  )


}
