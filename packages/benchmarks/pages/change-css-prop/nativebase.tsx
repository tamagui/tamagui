import dynamic from 'next/dynamic'

const Nativebase = () => {
  const NativebaseTest = dynamic(() => import('../../bench/change-css-prop/nativebase'), {
    ssr: false,
  })

  return <NativebaseTest />
}

export default Nativebase
