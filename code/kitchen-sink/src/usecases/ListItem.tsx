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

    <ListItem
      id="themed-list-item-inverse"
      title="Inverse"
      subTitle="Inverse list item"
      icon={ChevronRight}
      size="$3"
      themeInverse
      borderRadius="$3"
    />

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
      <ListItem
        id="themed-list-item-light-inverse"
        title="<ListItem themeInverse/>"
        subTitle="Forcing dark theme - light + inverse"
        icon={ChevronRight}
        size="$3"
        borderRadius="$3"
        themeInverse
        onPress={() => console.info('Light theme inverse list item pressed')}
      />
    </Theme>

    <Theme name="dark">
      <ListItem
        id="themed-list-item-dark-inverse"
        title="<ListItem themeInverse/>"
        subTitle="Forcing light theme - dark + inverse"
        icon={ChevronRight}
        size="$3"
        borderRadius="$3"
        themeInverse
        onPress={() => console.info('Dark theme inverse list item pressed')}
      />
    </Theme>
  </Stack>
)
