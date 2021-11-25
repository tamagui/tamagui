import dynamic from 'next/dynamic';

const CreateAndMountComponent = () => {
  const SCTest = dynamic(() => import('../../bench/create-and-mount-button/styled-components'), { ssr: false });

  return <SCTest />;
};

export default CreateAndMountComponent;
