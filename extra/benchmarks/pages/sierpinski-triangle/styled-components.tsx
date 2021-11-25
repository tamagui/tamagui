import dynamic from 'next/dynamic';

const SierpinskiTriangle = () => {
  const SCTest = dynamic(() => import('../../bench/sierpinski-triangle/styled-components'), { ssr: false });

  return <SCTest />;
};

export default SierpinskiTriangle;
