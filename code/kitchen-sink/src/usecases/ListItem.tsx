import { H5, ListItem, Separator, Stack, Theme } from 'tamagui'
import { ChevronRight, Star, Trash } from '@tamagui/lucide-icons'

export const ThemedListItem = () => (
  <Stack gap="$4">
    <H5>Should change:</H5>

    <ListItem
      id="themed-list-item-default"
      title="Default"
      subTitle="Default list item"
      icon={ChevronRight}
      size="$3"
      borderRadius="$3"
    />

    <Theme name="accent">
      <ListItem
        id="themed-list-item-accent"
        title="Accent"
        subTitle="Accent (contrasting) list item"
        icon={ChevronRight}
        size="$3"
        borderRadius="$3"
      />
    </Theme>

    <Separator />

    <H5>Are fixed:</H5>

    <Theme name="light">
      <ListItem
        id="themed-list-item-light"
        title='<Theme ="light"/>'
        subTitle="Forcing light theme"
        icon={ChevronRight}
        size="$3"
        borderRadius="$3"
        onPress={() => console.info('Light theme list item pressed')}
      />
    </Theme>

    <Theme name="dark">
      <ListItem
        id="themed-list-item-dark"
        title='<Theme ="dark"/>'
        subTitle="Forcing dark theme"
        icon={ChevronRight}
        size="$3"
        borderRadius="$3"
        onPress={() => console.info('Dark theme list item pressed')}
      />
    </Theme>

    <Theme name="light">
      <Theme name="accent">
        <ListItem
          id="themed-list-item-light-accent"
          title='<Theme name="accent">'
          subTitle="light + accent = light_accent (contrasting)"
          icon={ChevronRight}
          size="$3"
          borderRadius="$3"
          onPress={() => console.info('Light theme accent list item pressed')}
        />
      </Theme>
    </Theme>

    <Theme name="dark">
      <Theme name="accent">
        <ListItem
          id="themed-list-item-dark-accent"
          title='<Theme name="accent">'
          subTitle="dark + accent = dark_accent (contrasting)"
          icon={ChevronRight}
          size="$3"
          borderRadius="$3"
          onPress={() => console.info('Dark theme accent list item pressed')}
        />
      </Theme>
    </Theme>

    <Separator />

    <H5>Variant (outlined):</H5>

    <ListItem
      id="themed-list-item-outlined"
      variant="outlined"
      title="Outlined"
      subTitle="Using variant prop"
      icon={Star}
      size="$3"
      borderRadius="$3"
    />

    <Separator />

    <H5>Apply (context):</H5>

    <ListItem.Apply color="$red10">
      <ListItem
        id="themed-list-item-apply-color"
        title="With Apply color"
        subTitle="Icon inherits color from context"
        icon={Trash}
        size="$3"
        borderRadius="$3"
      />
    </ListItem.Apply>

    <ListItem.Apply variant="outlined" size="$2">
      <ListItem
        id="themed-list-item-apply-variant"
        title="With Apply variant"
        subTitle="Outlined via context"
        icon={Star}
        borderRadius="$3"
      />
    </ListItem.Apply>
  </Stack>
)
