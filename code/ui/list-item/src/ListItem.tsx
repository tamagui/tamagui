import { getFontSize } from "@tamagui/font-size";
import { getFontSized } from "@tamagui/get-font-sized";
import { getSize, getSpace } from "@tamagui/get-token";
import { withStaticProperties } from "@tamagui/helpers";
import { themeableVariants, YStack } from "@tamagui/stacks";
import { SizableText, wrapChildrenInText } from "@tamagui/text";
import type { FontSizeTokens, GetProps, SizeTokens } from "@tamagui/web";
import { createStyledContext, styled, View } from "@tamagui/web";
import {
  cloneElement,
  createElement,
  isValidElement,
  type FunctionComponent,
  type ReactNode,
} from "react";
import { useGetIcon } from "@tamagui/helpers-tamagui";

type ListItemIconProps = { color?: any; size?: any };
type IconProp = JSX.Element | FunctionComponent<ListItemIconProps> | null;

export type ListItemExtraProps = {
  icon?: IconProp;
  iconAfter?: IconProp;
  scaleIcon?: number;
  title?: ReactNode;
  subTitle?: ReactNode;
  iconSize?: SizeTokens;
};

export type ListItemProps = GetProps<typeof ListItemFrame> & ListItemExtraProps;

const NAME = "ListItem";

const context = createStyledContext({
  size: undefined,
});

const ListItemFrame = styled(View, {
  context,
  name: NAME,
  tag: "li",
  group: NAME as any,
  role: "listitem",

  ...themeableVariants.pressTheme.true,
  ...themeableVariants.hoverTheme.true,

  variants: {
    unstyled: {
      false: {
        size: "$true",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        width: "100%",
        borderColor: "$borderColor",
        maxWidth: "100%",
        overflow: "hidden",
        flexDirection: "row",
        backgroundColor: "$background",
        cursor: "default",
      },
    },

    size: {
      "...size": (val: SizeTokens, { tokens }) => {
        return {
          minHeight: tokens.size[val],
          paddingHorizontal: tokens.space[val],
          paddingVertical: getSpace(tokens.space[val], {
            shift: -4,
          }),
        };
      },
    },

    active: {
      true: {
        hoverStyle: {
          backgroundColor: "$background",
        },
      },
    },

    disabled: {
      true: {
        opacity: 0.5,
        // TODO breaking types
        pointerEvents: "none" as any,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === "1",
  },
});

const ListItemText = styled(SizableText, {
  context,
  name: "ListItemText",

  variants: {
    unstyled: {
      false: {
        color: "$color",
        size: "$true",
        flexGrow: 1,
        flexShrink: 1,
        ellipsis: true,
        cursor: "inherit",
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === "1",
  },
});

const ListItemSubtitle = styled(ListItemText, {
  name: "ListItemSubtitle",
  context,
  variants: {
    unstyled: {
      false: {
        opacity: 0.6,
        maxWidth: "100%",
        color: "$color",
      },
    },

    size: {
      "...size": (val, extras) => {
        const oneSmaller = getSize(val, {
          shift: -1,
          excludeHalfSteps: true,
        });
        const fontStyle = getFontSized(
          oneSmaller.key as FontSizeTokens,
          extras
        );
        return fontStyle;
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === "1",
  },
});

const ListItemTitle = styled(ListItemText, {
  name: "ListItemTitle",
  context,
});

const ListItemIcon = (props: {
  children: React.ReactNode;
  size?: SizeTokens;
  scaleIcon?: number;
}) => {
  const { children, size, scaleIcon = 1 } = props;
  const styledContext = context.useStyledContext();
  if (!styledContext) {
    throw new Error("Button.Icon must be used within a Button");
  }

  const sizeToken = size ?? styledContext.size ?? "$true";

  const iconSize = getFontSize(sizeToken as any) * scaleIcon;

  const getIcon = useGetIcon();

  return getIcon(children, {
    size: iconSize,
  });
};

const ListItemComponent = ListItemFrame.styleable<ListItemExtraProps>(
  function ListItem(propsIn, ref) {
    const {
      children,
      icon,
      iconAfter,
      theme: themeName,
      scaleIcon = 1,
      unstyled = false,
      subTitle,
      title,
      iconSize,
      ...rest
    } = propsIn;

    const size = propsIn.size || "$true";
    const getIcon = useGetIcon();
    const iconSizeNumber = getFontSize(iconSize || (size as any)) * scaleIcon;

    const [themedIcon, themedIconAfter] = [icon, iconAfter].map((icon, i) => {
      if (!icon) return null;
      const isBefore = i === 0;
      return getIcon(icon, {
        size: iconSizeNumber,
        ...{
          [isBefore ? "marginRight" : "marginLeft"]: `${
            iconSizeNumber * 0.4
          }%`,
        },
      });
    });

    const wrappedChildren = wrapChildrenInText(
      ListItemText,
      { children },
      propsIn.unstyled !== true
        ? {
            unstyled: process.env.TAMAGUI_HEADLESS === "1",
            fontSize: propsIn.size,
          }
        : undefined
    );

    return (
      <ListItemFrame ref={ref} {...rest}>
        {themedIcon}
        {title || subTitle ? (
          <YStack flex={1}>
            {title ? (
              typeof title === "string" ? (
                <ListItemTitle size={size as any}>{title}</ListItemTitle>
              ) : (
                title
              )
            ) : null}
            {subTitle ? (
              <>
                {typeof subTitle === "string" ? (
                  <ListItemSubtitle unstyled={unstyled} size={size}>
                    {subTitle}
                  </ListItemSubtitle>
                ) : (
                  subTitle
                )}
              </>
            ) : null}
            {wrappedChildren}
          </YStack>
        ) : (
          wrappedChildren
        )}
        {themedIconAfter}
      </ListItemFrame>
    );
  }
);

export const ListItem = withStaticProperties(ListItemComponent, {
  Frame: ListItemFrame,
  Text: ListItemText,
  Subtitle: ListItemSubtitle,
  Icon: ListItemIcon,
});
