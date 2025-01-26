import { randNumber, randProduct } from '@ngneat/falso'

const bags = {
  Clutch: '/bag/bag1.jpg',
  'Duffle Bag': '/bag/bag2.jpg',
  'Fanny Pack': '/bag/bag3.webp',
  'Messenger Bag': '/bag/bag4.webp',
  Satchel: '/bag/bag2.jpg',
  'Shoulder Bag': '/bag/bag3.webp',
  Tote: '/bag/bag1.jpg',
  Weekender: '/bag/bag4.webp',
  Wristlet: '/bag/bag2.jpg',
}

const watchNames = {
  'Analog Watch': '/watches/watch1.webp',
  'Chronograph Watch': '/watches/watch2.jpg',
  'Digital Watch': '/watches/watch3.jpg',
  'Dive Watch': '/watches/watch4.jpg',
  'Dress Watch': '/watches/watch5.jpeg',
  'Field Watch': '/watches/watch6.jpeg',
  'Mechanical Watch': '/watches/watch7.webp',
  'Pilot Watch': '/watches/watch8.webp',
  Smartwatch: '/watches/watch9.webp',
  'Sports Watch': '/watches/watch10.webp',
}

const shoeNames = {
  'Ballet Flat': '/shoes/shoe2.webp',
  Boot: '/shoes/shoe2.webp',
  Clog: '/shoes/shoe3.webp',
  Espadrille: '/shoes/shoe4.avif',
  Loafer: '/shoes/shoe5.jpg',
  Mule: '/shoes/shoe6.webp',
  Oxford: '/shoes/shoe7.jpg',
  Pump: '/shoes/shoe8.png',
  Sandal: '/shoes/shoe9.jpg',
  Sneaker: '/shoes/shoe10.webp',
}

const jacketNames = {
  'Bomber Jacket': '/jacket/jacket1.jpg',
  'Denim Jacket': '/jacket/jacket2.webp',
  'Leather Jacket': '/jacket/jacket3.jpg',
  Parka: '/jacket/jacket4.jpg',
  Peacoat: '/jacket/jacket5.jpg',
  'Puffer Jacket': '/jacket/jacket5.jpg',
  'Rain Jacket': '/jacket/jacket7.webp',
  'Trench Coat': '/jacket/jacket8.jpg',
  Windbreaker: '/jacket/jacket9.jpg',
  Overcoat: '/jacket/jacket10.jpg',
}

export const getProducts = () => {
  const allImages = [bags, watchNames, shoeNames, jacketNames]
  return Array.from({ length: 20 })
    .fill(0)
    .map((_, i) => {
      const product = randProduct()
      const category = allImages[i % allImages.length]
      const name = Object.keys(category)[i % 10]
      const image = category[name]
      return {
        id: i,
        name,
        price: product.price,
        discount: randNumber({ min: 10, max: 50 }),
        image: `/bento/images/${image}`,
      }
    })
}
