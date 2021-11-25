import dynamic from 'next/dynamic';

const CreateAndMountComponent = () => {
  const EmotionTest = dynamic(() => import('../../bench/change-a-variant/emotion'), { ssr: false });

  return <EmotionTest />;
};

export default CreateAndMountComponent;
