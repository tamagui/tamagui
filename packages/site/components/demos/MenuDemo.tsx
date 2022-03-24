import { Menu as MenuIcon } from '@tamagui/feather-icons'
// import { Menu } from '@tamagui/menu'
import React, { useState } from 'react'
import { Button, H3, Paragraph, XStack, YStack } from 'tamagui'

export default function MenuDemo() {
  const [show, setShow] = useState(false)
  return null

  // return (
  //   <Menu.Provider>
  //     <Menu
  //       onChangeOpen={setShow}
  //       trigger={
  //         <Button
  //           size="$6"
  //           icon={MenuIcon}
  //           theme={show ? 'active' : null}
  //           circular
  //           onPress={() => setShow((x) => !x)}
  //         />
  //       }
  //     >
  //       <Menu.Item>
  //         <YStack p="$6">
  //           <H3 selectable={false}>Menu contents</H3>
  //           <Paragraph selectable={false}>Lorem ipsum dolor sit amet.</Paragraph>
  //         </YStack>
  //       </Menu.Item>
  //     </Menu>
  //   </Menu.Provider>
  // )
}
