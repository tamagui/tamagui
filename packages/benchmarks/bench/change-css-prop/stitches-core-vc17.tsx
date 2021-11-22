import React from 'react';
import { TestComponentProps, TestRunner } from '../TestRunner';
import { buttonStyles } from '../utils/buttonStyles';
import { css } from '../utils/stitches-core-v025.config';

const button = css({
  ...(buttonStyles as any),
});

const Test = ({ testIndex }: TestComponentProps) => {
  return (
    <button
      className={button({
        css: {
          '--test-index': testIndex,
          backgroundColor: `hsl(${Math.floor(Math.random() * 360)} 80% 80%)`,
          padding: '20px',
        },
      })}
    >
      testing
    </button>
  );
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
