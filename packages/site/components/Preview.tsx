import { Box } from 'snackui';

export const Preview = ({ css, ...props }) => (
  <Box
    {...props}
    data-preview
    css={{
      margin: 0,
      overflow: 'auto',
      boxShadow: '0 0 0 1px $colors$slate7',
      borderTopLeftRadius: '$3',
      borderTopRightRadius: '$3',
      padding: '$3',
      position: 'relative',
      ...css,
    }}
  />
);
