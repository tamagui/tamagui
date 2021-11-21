import React from 'react';
import { TestComponentProps, TestRunner } from '../TestRunner';
import { Tree } from '../utils/Tree';
import styled from 'styled-components';

export const Test = ({ testIndex }: TestComponentProps) => {
  // This purposefully creates the styled component inside the Test component
  // so that we can measure the time it takes using the React profiler

  const getColor = (color) => {
    switch (color) {
      case 0:
        return '#14171A';
      case 1:
        return '#AAB8C2';
      case 2:
        return '#E6ECF0';
      case 3:
        return '#FFAD1F';
      case 4:
        return '#F45D22';
      case 5:
        return '#E0245E';
      default:
        return 'transparent';
    }
  };

  const View = styled('div')({
    alignItems: 'stretch',
    borderWidth: '0',
    borderStyle: 'solid',
    boxSizing: 'border-box',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    flexShrink: 0,
    margin: '0',
    padding: '0',
    position: 'relative',
    minHeight: '0',
    minWidth: '0',
  });

  const Box = styled(View)((props: any) => ({
    alignSelf: 'flex-start',
    flexDirection: props.layout === 'column' ? ('column' as any) : ('row' as any),
    padding: props.outer ? '4px' : '0',
    ...(props.fixed
      ? {
          height: '6px',
          width: '6px',
        }
      : {}),

    backgroundColor: getColor(props.color),
  }));

  return <Tree breadth={2} depth={7} id={0} wrap={1} box={Box} />;
};

const StitchesTest = () => {
  return <TestRunner numberOfRuns={3} iterationN={50} TestComponent={Test} />;
};

export default StitchesTest;
