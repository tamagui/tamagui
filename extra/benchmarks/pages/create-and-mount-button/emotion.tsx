import dynamic from 'next/dynamic';

const CreateAndMountComponent = () => {
  const EmotionTest = dynamic(() => import('../../bench/create-and-mount-button/emotion'), { ssr: false });

  return <EmotionTest />;
};

export default CreateAndMountComponent;
