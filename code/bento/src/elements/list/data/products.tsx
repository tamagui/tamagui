import { useEffect, useState } from 'react'
import { randNumber, randProduct, randCity } from '@ngneat/falso'

const bags = {
  Clutch: 'https://tamagui.dev/bento/images/bag/bag1.webp',
  'Duffle Bag': 'https://tamagui.dev/bento/images/bag/bag2.webp',
  'Fanny Pack': 'https://tamagui.dev/bento/images/bag/bag3.webp',
  'Messenger Bag': 'https://tamagui.dev/bento/images/bag/bag4.webp',
  Satchel: 'https://tamagui.dev/bento/images/bag/bag2.webp',
  'Shoulder Bag': 'https://tamagui.dev/bento/images/bag/bag3.webp',
  Tote: 'https://tamagui.dev/bento/images/bag/bag1.webp',
  Weekender: 'https://tamagui.dev/bento/images/bag/bag4.webp',
  Wristlet: 'https://tamagui.dev/bento/images/bag/bag2.webp',
}

const watchNames = {
  'Analog Watch': 'https://tamagui.dev/bento/images/watches/watch1.webp',
  'Chronograph Watch': 'https://tamagui.dev/bento/images/watches/watch2.jpg',
  'Digital Watch': 'https://tamagui.dev/bento/images/watches/watch3.jpg',
  'Dive Watch': 'https://tamagui.dev/bento/images/watches/watch4.jpg',
  'Dress Watch': 'https://tamagui.dev/bento/images/watches/watch5.jpeg',
  'Field Watch': 'https://tamagui.dev/bento/images/watches/watch6.jpeg',
  'Mechanical Watch': 'https://tamagui.dev/bento/images/watches/watch7.webp',
  'Pilot Watch': 'https://tamagui.dev/bento/images/watches/watch8.webp',
  Smartwatch: 'https://tamagui.dev/bento/images/watches/watch9.webp',
  'Sports Watch': 'https://tamagui.dev/bento/images/watches/watch10.webp',
}

const shoeNames = {
  'Ballet Flat': 'https://tamagui.dev/bento/images/shoes/shoe2.webp',
  Boot: 'https://tamagui.dev/bento/images/shoes/shoe2.webp',
  Clog: 'https://tamagui.dev/bento/images/shoes/shoe3.webp',
  Espadrille: 'https://tamagui.dev/bento/images/shoes/shoe4.avif',
  Loafer: 'https://tamagui.dev/bento/images/shoes/shoe5.jpg',
  Mule: 'https://tamagui.dev/bento/images/shoes/shoe6.webp',
  Oxford: 'https://tamagui.dev/bento/images/shoes/shoe7.jpg',
  Pump: 'https://tamagui.dev/bento/images/shoes/shoe8.png',
  Sandal: 'https://tamagui.dev/bento/images/shoes/shoe9.jpg',
  Sneaker: 'https://tamagui.dev/bento/images/shoes/shoe10.webp',
}

const jacketNames = {
  'Bomber Jacket': 'https://tamagui.dev/bento/images/jacket/jacket1.jpg',
  'Denim Jacket': 'https://tamagui.dev/bento/images/jacket/jacket2.webp',
  'Leather Jacket': 'https://tamagui.dev/bento/images/jacket/jacket3.jpg',
  Parka: 'https://tamagui.dev/bento/images/jacket/jacket4.jpg',
  Peacoat: 'https://tamagui.dev/bento/images/jacket/jacket5.jpg',
  'Puffer Jacket': 'https://tamagui.dev/bento/images/jacket/jacket5.jpg',
  'Rain Jacket': 'https://tamagui.dev/bento/images/jacket/jacket7.webp',
  'Trench Coat': 'https://tamagui.dev/bento/images/jacket/jacket8.jpg',
  Windbreaker: 'https://tamagui.dev/bento/images/jacket/jacket9.jpg',
  Overcoat: 'https://tamagui.dev/bento/images/jacket/jacket10.jpg',
}

export const getProducts = () => {
  const allImages = [bags, watchNames, shoeNames, jacketNames]
  return Array.from({ length: 20 })
    .fill(0)
    .map((_, i) => {
      const category = allImages[i % allImages.length]
      const name = Object.keys(category)[i % 10]
      const image = category[name]
      const product = randProduct()
      const city = randCity()
      return {
        id: i,
        name,
        category: product.category,
        price: product.price,
        discount: randNumber({ min: 10, max: 50 }),
        image: image,
        desc: product.description,
        city: city,
      }
    })
}

export type Product = ReturnType<typeof getProducts>[0]

export function useData() {
  const [data, setData] = useState<Product[]>([])
  useEffect(() => {
    setData(getProducts())
  }, [])
  return { data }
}
