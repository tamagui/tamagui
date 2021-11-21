import React from 'react';
import { TestComponentProps, TestRunner } from '../TestRunner';
import { buttonStyles, buttonInterpolatedVariants } from '../utils/buttonStyles';
import styled from 'styled-components';

const Button = styled('button')((props) => ({
  ...(buttonStyles as any),
  ...(buttonInterpolatedVariants(props) as any),
}));

const Test: React.FunctionComponent<TestComponentProps> = ({ testIndex }: TestComponentProps) => {
  const variants = {
    variant: testIndex % 2 === 0 ? 'red' : 'blue',
    size: testIndex % 2 === 0 ? '1' : '2',
  };
  return <Button {...variants}>testing</Button>;
};

const StitchesTest = () => {
  return (
    <>
      <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />

      <div style={{ opacity: 0, pointerEvents: 'none' }}>
        <Button>we mount the button outside the test to make sure we're not clocking any mount time</Button>
      </div>
    </>
  );
};

export default StitchesTest;
