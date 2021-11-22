import React from 'react';
import { TestComponentProps, TestRunner } from '../TestRunner';
import { css } from '../utils/stitches-core-v025.config';
import { buttonStyles } from '../utils/buttonStyles';

/** This test aims to measure the baseline of just using React with vanilla CSS techniques (no CSS-in-JS) */
const Test = ({ testIndex }: TestComponentProps) => {
  return <button style={{ '--test-index': testIndex, ...(buttonStyles as any) }}>testing</button>;
};

const StitchesTest = () => {
  return <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />;
};

export default StitchesTest;
