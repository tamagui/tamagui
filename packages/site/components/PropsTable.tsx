// import { AccessibleIcon } from '@tamagui/feather-icons'
import { Minus } from '@tamagui/feather-icons'
import React from 'react'
import { Paragraph, Theme, XStack, YStack, styled } from 'tamagui'

import { Code } from './Code'
import { RegionTable } from './RegionTable'

type PropDef = {
  name: string
  required?: boolean
  default?: string | boolean
  type: string
  description?: string
}

export function PropsTable({
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  data: PropDef[]
  'aria-label'?: string
  'aria-labelledby'?: string
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy)
  return (
    <RegionTable
      width="100%"
      // textAlign="left"
      // borderCollapse="collapse"
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
      mt="$2"
    >
      <thead>
        <tr>
          <YStack
            display="table-head"
            tag="th"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            pb="$3"
            pr="$4"
          >
            <Paragraph fontWeight="600" size="$4" color="$color2">
              Prop
            </Paragraph>
          </YStack>
          <YStack
            display="table-head"
            tag="th"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            pb="$3"
            pr="$4"
          >
            <Paragraph fontWeight="600" size="$4" color="$color2">
              Type
            </Paragraph>
          </YStack>
          <YStack
            display="table-head"
            tag="th"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            pb="$3"
            pr="$4"
          >
            <Paragraph fontWeight="600" size="$4" color="$color2">
              Default
            </Paragraph>
          </YStack>
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, type, required, default: defaultValue, description }, i) => (
          <React.Fragment key={`${name}-${i}`}>
            <tr>
              <TD>
                <XStack ai="center" space>
                  <Code colored>
                    {name}
                    {required ? '*' : null}
                  </Code>
                </XStack>
              </TD>
              <TD>
                <Code bc="$bg3">{type}</Code>
              </TD>
              <TD>
                {Boolean(defaultValue) ? (
                  <Code bc="$bg3">{defaultValue}</Code>
                ) : (
                  <YStack>
                    {/*  as={AccessibleIcon} label="No default value" */}
                    <Minus size={12} opacity={0.5} color="var(--color)" />
                  </YStack>
                )}
              </TD>
            </tr>
            {description && (
              <tr>
                <td colSpan={2}>
                  <Theme name="gray">
                    <YStack p="$2">
                      <Paragraph size="$2" color="$color2">
                        {description}
                      </Paragraph>
                    </YStack>
                  </Theme>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </RegionTable>
  )
}

const TD = styled(XStack, {
  display: 'table-cell',
  tag: 'td',
  paddingTop: 10,
})
