import dynamic from 'next/dynamic';

const CreateAndMountComponent = () => {
  const BaselineTest = dynamic(() => import('../../bench/change-css-prop/baseline'), { ssr: false });

  return <BaselineTest />;
};

export default CreateAndMountComponent;
