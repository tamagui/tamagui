import React from 'react';
import { TestComponentProps, TestRunner } from '../TestRunner';
import { buttonStyles, buttonVariants } from '../utils/buttonStyles';
import { css } from '../utils/stitches-core-v025.config';

const button = css({
  ...(buttonStyles as any),
  ...(buttonVariants as any),
});

const Test: React.FunctionComponent<TestComponentProps> = ({ testIndex }: TestComponentProps) => {
  const variants = {
    variant: testIndex % 2 === 0 ? 'red' : 'blue',
    size: testIndex % 2 === 0 ? '1' : '2',
  };
  return <button className={button({ ...variants })}>testing</button>;
};

const StitchesTest = () => {
  return (
    <>
      <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />

      <div style={{ opacity: 0, pointerEvents: 'none' }}>
        <button className={button()}>
          we mount the button outside the test to make sure we're not clocking any mount time
        </button>
      </div>
    </>
  );
};

export default StitchesTest;
