// we can bring this page back if we wanna do custom checkout
export default () => null
// import { getDefaultLayout } from '@lib/getLayout'
// import { stripe } from '@lib/stripe'
// import { getStripe } from '@lib/stripeClient'
// import { Elements } from '@stripe/react-stripe-js'
// import { PaymentElement } from '@stripe/react-stripe-js'
// import { StripeError } from '@stripe/stripe-js'
// import { GetServerSideProps, NextPage } from 'next'
// import { NextSeo } from 'next-seo'
// import { Stripe } from 'stripe'
// type CheckoutPageProps = {
//   product: Stripe.Product
//   prices: Stripe.Price[]
// }

// const Page = ({ product, prices }: CheckoutPageProps) => {
//   console.log(product, prices)
  
//   return (
//     <>
//       <NextSeo title={`${product.name} — Checkout — Tamagui`} />

//       <Elements
//         stripe={getStripe()}
//         options={{
//           clientSecret: '',
//         }}
//       >
//         <CheckoutForm />
//       </Elements>
//     </>
//   )
// }

// const CheckoutForm = () => {
//   return (
//     <form>
//       <PaymentElement />
//       <button>Submit</button>
//     </form>
//   )
// }

// Page.getLayout = getDefaultLayout

// export default Page

// export const getServerSideProps: GetServerSideProps<CheckoutPageProps> = async ({
//   params,
// }) => {
//   const productId = params?.productId
//   if (typeof productId !== 'string') {
//     return {
//       notFound: true,
//     }
//   }
//   try {
//     const [product, prices] = await Promise.all([
//       stripe.products.retrieve(productId),
//       stripe.prices.list({
//         product: productId,
//       }),
//     ])

//     return {
//       props: {
//         product,
//         prices: prices.data,
//       },
//     }
//   } catch (error: unknown) {
//     if (error) {
//       console.error(error)
//     }
//     return {
//       notFound: true,
//     }
//   }
// }
