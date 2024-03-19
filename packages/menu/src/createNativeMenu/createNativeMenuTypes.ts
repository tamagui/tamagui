import type { ImageProps } from "react-native";
import type {
  ContextMenuView,
  MenuAuxiliaryPreviewConfig,
  ContextMenuButton,
} from "react-native-ios-context-menu";
import type {
  ImageOptions,
  ImageSystemSymbolConfiguration,
} from "react-native-ios-context-menu/build/types/ImageItemConfig";
import type { ComponentProps } from "react";

import type { SFSymbol } from "sf-symbols-typescript";

export type MenuProps = {
  children: React.ReactNode;
  native?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Callback function indicating that the menu intends to open or close. Passes a `willOpen` boolean argument indicating whether it is opening or closing.
   * Unlike `onOpenChange`, thi
   * @platform `ios`
   */
  onOpenWillChange?: (willOpen: boolean) => void;

  __unsafeIosProps?:
    | ComponentProps<typeof ContextMenuView>
    | ComponentProps<typeof ContextMenuButton>;
};

/**
 * See the docs on `react-native-ios-context-menu` for usage: https://github.com/dominicstop/react-native-ios-context-menu#ContextMenuView-Auxiliary-Preview---Example-01
 */
export type ContextMenuAuxliliaryProps = Omit<
  MenuAuxiliaryPreviewConfig,
  "marginAuxiliaryPreview"
> & {
  children: React.ReactNode | ((options: { dismissMenu: () => void }) => React.ReactNode);
  onDidShow?: () => void;
  marginWithScreenEdge?: number;
  onWillShow?: () => void;
};

export type MenuTriggerProps = {
  children: React.ReactElement;
  asChild?: boolean;
  /**
   * Determine whether the menu should open on `press` or `longPress`. Defaults to `press` for `DropdownMenu` and `longPress` for `ContextMenu`.
   *
   * Only applies for `ios` and `android`.
   */
  action?: "press" | "longPress";
};

export type MenuContentProps = {
  children: React.ReactNode;
};
export type ContextMenuContentProps = MenuContentProps;

export type MenuGroupProps = {
  children: React.ReactNode;
};

export type MenuItemProps = {
  children: React.ReactNode;
  /**
   * If you want to pass a React text node to `<ItemTitle />`, then you need to use this prop. This gets used on iOS and Android.
   */
  textValue?: string;
} & {
  disabled?: boolean;
  hidden?: boolean;
  destructive?: boolean;
  key: string;
};

export interface MenuItemCommonProps {
  /**
   * The name of an iOS-only SF Symbol. For a full list, see https://developer.apple.com/sf-symbols/.
   * @deprecated Please use the `name` inside of the `ios` prop instead.
   * @platform ios
   */
  iosIconName?: string;
  /**
   * Icon configuration to be used on iOS. You can pass a SF Symbol icon using the `name` prop.
   * Additionally, you can configure the SF Symbol's features like weight, scale, color etc. by passing
   * the corresponding props. Note that some of those features require iOS 15+. For the full list of options,
   * refer to the ImageSystemSymbolConfiguration type in react-native-ios-context-menu
   *
   * @platform ios
   */
  ios?: ImageSystemSymbolConfiguration & {
    name: SFSymbol;
  };
  /**
   * The name of an android-only resource drawable. For a full list, see https://developer.android.com/reference/android/R.drawable.html.
   *
   * @platform android
   */
  androidIconName?: string;
}

export type MenuItemIconProps = MenuItemCommonProps;

export type MenuItemImageProps = MenuItemCommonProps & {
  /**
   * `source={require('path/to/image')}`
   */
  source: ImageProps["source"];
  ios?: {
    style?: ImageOptions;
    lazy?: boolean;
  };
};

export type MenuArrowProps = {};

export type MenuSubTriggerProps = MenuItemProps & {
  key: string;
};

export type MenuSubProps = {
  children?: React.ReactNode;
};

export type MenuSubContentProps = {
  children: React.ReactNode;
};
export type ContextMenuSubContentProps = ContextMenuContentProps;

export type MenuItemTitleProps = {
  children: string | React.ReactNode;
};
export type MenuItemSubtitleProps = {
  children: string;
};
export type MenuSeparatorProps = {};
export type MenuCheckboxItemProps = Omit<MenuItemProps, "onSelect"> & {
  value: "mixed" | "on" | "off" | boolean;
  onValueChange?: (state: "mixed" | "on" | "off", prevState: "mixed" | "on" | "off") => void;
  key: string;
};

export type MenuItemIndicatorProps = {
  children?: React.ReactNode;
};

export type MenuLabelProps = {
  children: string;
  /**
   * If you want to pass a React text node to `<Lable />`, then you need to use this prop. This gets used on iOS and Android.
   */
  textValue?: string;
};

type Not<T extends object, O extends keyof NonNullable<T>> = Omit<T, O>;

export type ContextMenuPreviewProps = {
  children: React.ReactNode | (() => React.ReactNode);
  size?: NonNullable<React.ComponentProps<typeof ContextMenuView>["previewConfig"]>["previewSize"];
  onPress?: React.ComponentProps<typeof ContextMenuView>["onPressMenuPreview"];
} & Not<
  NonNullable<React.ComponentProps<typeof ContextMenuView>["previewConfig"]>,
  "targetViewNode" | "previewSize" | "previewType"
>;
