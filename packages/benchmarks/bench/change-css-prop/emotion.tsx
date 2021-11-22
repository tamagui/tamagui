import React from 'react';
import { TestComponentProps, TestRunner } from '../TestRunner';
import { buttonStyles } from '../utils/buttonStyles';
import styled from '@emotion/styled';

const Button: any = styled('button')((props: any) => ({
  ...buttonStyles,
  ...props.css,
}));

const Test = ({ testIndex }: TestComponentProps) => {
  return (
    <Button
      css={{
        '--test-index': testIndex,
        backgroundColor: `hsl(${Math.floor(Math.random() * 360)} 80% 80%)`,
        padding: '20px',
      }}
    >
      testing
    </Button>
  );
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
