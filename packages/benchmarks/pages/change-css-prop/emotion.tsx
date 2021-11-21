import dynamic from 'next/dynamic';

const CreateAndMountComponent = () => {
  const EmotionTest = dynamic(() => import('../../bench/change-css-prop/emotion'), { ssr: false });

  return <EmotionTest />;
};

export default CreateAndMountComponent;
