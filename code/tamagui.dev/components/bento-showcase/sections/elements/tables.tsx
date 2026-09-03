import { YStack } from 'tamagui'

import * as Tables from '@tamagui/bento/component/elements/tables'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/bento-showcase/_Showcase'

export function tables() {
  return (
    <YStack
      paddingBottom="2 gtLg:0"
      gap="12"
      paddingTop="2 gtLg:0"
      paddingRight="2 gtLg:0"
      paddingLeft="2 gtLg:0"
    >
      <Showcase fileName={Tables.UsersTable.fileName} title="Users Table with Avatar">
        <Wrapper>
          <Tables.UsersTable />
        </Wrapper>
      </Showcase>

      <Showcase fileName={Tables.BasicTable.fileName} title="Basic Table">
        <Wrapper>
          <Tables.BasicTable />
        </Wrapper>
      </Showcase>

      <Showcase
        fileName={Tables.SortableTable.fileName}
        title="Table with Pagination and Sorting Ability"
      >
        <Wrapper>
          <Tables.SortableTable />
        </Wrapper>
      </Showcase>
    </YStack>
  )
}
