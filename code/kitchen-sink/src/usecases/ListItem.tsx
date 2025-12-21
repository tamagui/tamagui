import { H5, ListItem, Separator, Stack, Theme } from 'tamagui'
import { ChevronRight } from '@tamagui/lucide-icons'

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
  </Stack>
)
