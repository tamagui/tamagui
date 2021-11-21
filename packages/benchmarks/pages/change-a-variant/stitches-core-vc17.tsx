import dynamic from 'next/dynamic';

const CreateAndMountComponent = () => {
  const StitchesTest = dynamic(() => import('../../bench/change-a-variant/stitches-core-vc17'), { ssr: false });

  return <StitchesTest />;
};

export default CreateAndMountComponent;
