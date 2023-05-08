import { getDefaultLayout } from '@components/layouts/DefaultLayout'
import { MerchItem, MergeItemProps } from '@components/MerchItem'
import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { GetServerSideProps } from 'next'
import { H1, XStack } from 'tamagui'

import { ContainerLarge } from '../components/Container'

type MerchPageProps = { items: MergeItemProps[] }
export default function Merch({ items }: MerchPageProps) {
  return (
    <>
      <TitleAndMetaTags
        title="Merch — Tamagui"
        description="Tamagui goodies and merch."
        pathname="/merch"
      />

      <XStack my="$10" jc="center" space>
        <H1 ta="center">Tamagui Merch</H1>
      </XStack>
      <ContainerLarge space="$4">
        <XStack gap="$4" spaceDirection="both" flexWrap="wrap" jc="center">
          {items.map((item) => (
            <MerchItem key={item.title} {...item} />
          ))}
        </XStack>
      </ContainerLarge>
    </>
  )
}

Merch.getLayout = getDefaultLayout

export const getServerSideProps: GetServerSideProps<MerchPageProps> = async () => {
  return {
    props: {
      items: [
        {
          title: 'Design Systems Embroider',
          price: '$26.00',
          isAvailable: true,
          url: 'https://tamagui-store.launchcart.store/design-systems-embroider/p/ovj4jw',
          image:
            'https://cdn.launchcart.com/s47380/1683518039-3497fc71-4c5b-4098-aae9-a27815bbc161.jpg',
        },
      ],
    },
  }
}
