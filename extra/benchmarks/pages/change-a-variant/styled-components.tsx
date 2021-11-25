import dynamic from 'next/dynamic';

const CreateAndMountComponent = () => {
  const SCTest = dynamic(() => import('../../bench/change-a-variant/styled-components'), { ssr: false });

  return <SCTest />;
};

export default CreateAndMountComponent;
