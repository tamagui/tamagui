import dynamic from 'next/dynamic';

const SierpinskiTriangle = () => {
  const EmotionTest = dynamic(() => import('../../bench/sierpinski-triangle/emotion'), { ssr: false });

  return <EmotionTest />;
};

export default SierpinskiTriangle;
