import dynamic from 'next/dynamic';

const CreateAndMountComponent = () => {
  const BaselineTest = dynamic(() => import('../../bench/create-and-mount-button/baseline'), { ssr: false });

  return <BaselineTest />;
};

export default CreateAndMountComponent;
