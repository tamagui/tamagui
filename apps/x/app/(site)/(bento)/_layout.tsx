import {Slot} from 'vxs'
import { Footer } from '~/features/site/Footer'
export default function Layout() {
    return <>
      <Slot/>
      <Footer/>
    </>

}
