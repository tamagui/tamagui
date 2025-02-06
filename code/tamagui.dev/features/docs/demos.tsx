import { Suspense, use } from 'react'
import { Spinner, View } from 'tamagui'

const cached: any = {}

function getLazyComponent<Import extends Function>(importFunc: Import): Import {
  if (cached[importFunc]) {
    return cached[importFunc]
  }

  cached[importFunc] = importFunc?.()

  return cached[importFunc]
}

export function lazyDemo(importFunc: () => Promise<any>) {
  return () => {
    const Component = use(getLazyComponent(importFunc))

    return (
      <Suspense fallback={<Spinner />}>
        <View display="contents" id="demo">
          {/* @ts-ignore */}
          <Component />
        </View>
      </Suspense>
    )
  }
}

export const BuildAButtonDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/BuildAButtonDemo').then((x) => x.BuildAButtonDemo)
)

export const AccordionDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/AccordionDemo').then((x) => x.AccordionDemo)
)

export const ThemeBuilderDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ThemeBuilderDemo').then((x) => x.ThemeBuilderDemo)
)

export const StacksDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/StacksDemo').then((x) => x.StacksDemo)
)
export const SheetDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/SheetDemo').then((x) => x.SheetDemo)
)
export const ShapesDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ShapesDemo').then((x) => x.ShapesDemo)
)
export const TextDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/TextDemo').then((x) => x.TextDemo)
)
export const ButtonDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ButtonDemo').then((x) => x.ButtonDemo)
)
export const ThemeInverseDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ThemeInverseDemo').then((x) => x.ThemeInverseDemo)
)
export const FormsDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/FormsDemo').then((x) => x.FormsDemo)
)
export const InputsDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/InputsDemo').then((x) => x.InputsDemo)
)

export const NewInputsDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/NewInputsDemo').then((x) => x.NewInputsDemo)
)
export const LinearGradientDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/LinearGradientDemo').then((x) => x.LinearGradientDemo)
)
export const HeadingsDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/HeadingsDemo').then((x) => x.HeadingsDemo)
)
export const SeparatorDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/SeparatorDemo').then((x) => x.SeparatorDemo)
)
export const ImageDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ImageDemo').then((x) => x.ImageDemo)
)

export const WebNativeImageDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/WebNativeImageDemo').then((x) => x.WebNativeImageDemo)
)

export const LabelDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/LabelDemo').then((x) => x.LabelDemo)
)
export const GroupDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/GroupDemo').then((x) => x.GroupDemo)
)
export const SelectDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/SelectDemo').then((x) => x.SelectDemo)
)
export const CardDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/CardDemo').then((x) => x.CardDemo)
)
export const AvatarDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/AvatarDemo').then((x) => x.AvatarDemo)
)
export const ProgressDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ProgressDemo').then((x) => x.ProgressDemo)
)
export const ListItemDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ListItemDemo').then((x) => x.ListItemDemo)
)
export const TabsDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/TabsDemo').then((x) => x.TabsDemo)
)
export const TabsAdvancedDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/TabsAdvancedDemo').then((x) => x.TabsAdvancedDemo)
)

export const TooltipDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/TooltipDemo').then((x) => x.TooltipDemo)
)
export const PopoverDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/PopoverDemo').then((x) => x.PopoverDemo)
)
export const DialogDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/DialogDemo').then((x) => x.DialogDemo)
)
export const ToastDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ToastDemo').then((x) => x.ToastDemo)
)
export const ToastDuplicateDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ToastDuplicateDemo').then((x) => x.ToastDuplicateDemo)
)
export const AnimationsDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/AnimationsDemo').then((x) => x.AnimationsDemo)
)
export const AlertDialogDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/AlertDialogDemo').then((x) => x.AlertDialogDemo)
)
export const AnimationsHoverDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/AnimationsHoverDemo').then((x) => x.AnimationsHoverDemo)
)
export const AnimationsEnterDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/AnimationsEnterDemo').then((x) => x.AnimationsEnterDemo)
)
export const AnimationsPresenceDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/AnimationsPresenceDemo').then(
    (x) => x.AnimationsPresenceDemo
  )
)
export const SwitchDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/SwitchDemo').then((x) => x.SwitchDemo)
)
export const SwitchHeadlessDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/SwitchHeadlessDemo').then((x) => x.SwitchHeadlessDemo)
)
export const SwitchUnstyledDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/SwitchUnstyledDemo').then((x) => x.SwitchUnstyledDemo)
)
export const SliderDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/SliderDemo').then((x) => x.SliderDemo)
)
export const SpinnerDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/SpinnerDemo').then((x) => x.SpinnerDemo)
)
export const AddThemeDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/AddThemeDemo').then((x) => x.AddThemeDemo)
)
export const UpdateThemeDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/UpdateThemeDemo').then((x) => x.UpdateThemeDemo)
)
export const ReplaceThemeDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ReplaceThemeDemo').then((x) => x.ReplaceThemeDemo)
)
export const LucideIconsDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/LucideIconsDemo').then((x) => x.LucideIconsDemo)
)
export const ScrollViewDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ScrollViewDemo').then((x) => x.ScrollViewDemo)
)
export const ColorsDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ColorsDemo').then((x) => x.ColorsDemo)
)
export const TokensDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/TokensDemo').then((x) => x.TokensDemo)
)
export const ToggleGroupDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/ToggleGroupDemo').then((x) => x.ToggleGroupDemo)
)
export const CheckboxDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/CheckboxDemo').then((x) => x.CheckboxDemo)
)
export const CheckboxHeadlessDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/CheckboxHeadlessDemo').then((x) => x.CheckboxHeadlessDemo)
)
export const CheckboxUnstyledDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/CheckboxUnstyledDemo').then((x) => x.CheckboxUnstyledDemo)
)
export const RadioGroupDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/RadioGroupDemo').then((x) => x.RadioGroupDemo)
)
export const RadioGroupHeadlessDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/RadioGroupHeadlessDemo').then(
    (x) => x.RadioGroupHeadlessDemo
  )
)
export const RadioGroupUnstyledDemo = lazyDemo(() =>
  import('@tamagui/demos/demo/RadioGroupUnstyledDemo').then(
    (x) => x.RadioGroupUnstyledDemo
  )
)
