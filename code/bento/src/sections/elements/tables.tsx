import { YStack } from 'tamagui'

import * as Tables from '../../components/elements/tables'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '../../components/general/_Showcase'

export function tables() {
  return (
    <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
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
