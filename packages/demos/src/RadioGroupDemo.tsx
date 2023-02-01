import {
  Label,
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
  SizeTokens,
  XStack,
  YStack,
} from 'tamagui'

export function RadioGroupDemo() {
  return (
    <YStack w={300} ai="center" space="$3">
      <RadioGroup>
        <RadioWithLabel label="small" size="$1" />
        <RadioWithLabel label="medium" size="$2" />
        <RadioWithLabel label="large" size="$3" />
      </RadioGroup>
    </YStack>
  )
}

function RadioWithLabel(props: { size: SizeTokens; label: string }) {
  const id = `radio-${props.size.toString().slice(1)}`
  return (
    <XStack w={300} ai="center" space="$4">
      <RadioGroupItem value={props.label} size="$4" id={id}>
        <RadioGroupIndicator size={props.size} />
      </RadioGroupItem>
      <Label className="Label" htmlFor={id}>
        {props.label}
      </Label>
    </XStack>
  )
}

// export function RadioGroupDemo() {
//   return (
//     <YStack w={300} ai="center" space="$3">
//       <RadioGroup
//         className="RadioGroupRoot"
//         defaultValue="default"
//         aria-label="View density"
//       >
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <RadioGroupItem value="default" id="r1">
//             <RadioGroupIndicator />
//           </RadioGroupItem>
//           <Label className="Label" htmlFor="r1">
//             Default
//           </Label>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <RadioGroupItem className="RadioGroupItem" value="comfortable" id="r2">
//             <RadioGroupIndicator className="RadioGroupIndicator" />
//           </RadioGroupItem>
//           <Label className="Label" htmlFor="r2">
//             Comfortable
//           </Label>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <RadioGroupItem className="RadioGroupItem" value="compact" id="r3">
//             <RadioGroupIndicator className="RadioGroupIndicator" />
//           </RadioGroupItem>
//           <Label className="Label" htmlFor="r3">
//             Compact
//           </Label>
//         </div>
//       </RadioGroup>
//     </YStack>
//   )
// }
