import dynamic from 'next/dynamic';

const SierpinskiTriangle = () => {
  const EmotionTest = dynamic(() => import('../../bench/mount-deep-tree/emotion'), { ssr: false });

  return <EmotionTest />;
};

export default SierpinskiTriangle;
