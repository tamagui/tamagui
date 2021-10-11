import React from 'react';
import NextLink from 'next/link';
import NextRouter from 'next/router';
import rangeParser from 'parse-numeric-range';
import * as DS from 'snackui';
import { Link2Icon, ChevronDownIcon } from '@modulz/radix-icons';
import { Preview } from './Preview';
import { DemoButton } from './DemoButton';
import { Pre } from './Pre';
import { Box } from 'snackui';

export const components = {
  ...DS,
  h1: (props) => (
    <DS.Text {...props} as="h1" size="8" css={{ fontWeight: 500, mb: '$2', lineHeight: '40px' }} />
  ),
  h2: ({ children, id, ...props }) => (
    <LinkHeading id={id} css={{ mt: '$7', mb: '$2' }}>
      <DS.Title
        {...props}
        as={'h2' as any}
        size="2"
        id={id}
        css={{ scrollMarginTop: '$6' }}
        data-heading
      >
        {children}
      </DS.Title>
    </LinkHeading>
  ),
  h3: ({ children, id, ...props }) => (
    <LinkHeading id={id} css={{ mt: '$7', mb: '$1' }}>
      <DS.Title {...props} as={'h3' as any} id={id} css={{ scrollMarginTop: '$6' }} data-heading>
        {children}
      </DS.Title>
    </LinkHeading>
  ),
  h4: (props) => (
    <DS.Text as="h4" {...props} size="4" css={{ mb: '$3', lineHeight: '27px', fontWeight: 500 }} />
  ),
  p: (props) => <DS.Paragraph {...props} css={{ mb: '$3' }} />,
  a: ({ href = '', ...props }) => {
    if (href.startsWith('http')) {
      return (
        <DS.Link
          {...props}
          variant="blue"
          href={href}
          css={{ fontSize: 'inherit' }}
          target="_blank"
          rel="noopener"
        />
      );
    }
    return (
      <NextLink href={href} passHref>
        <DS.Link {...props} css={{ color: 'inherit', fontSize: 'inherit' }} />
      </NextLink>
    );
  },

  hr: (props) => <DS.Divider size="2" {...props} css={{ my: '$6', mx: 'auto' }} />,
  ul: (props) => <DS.Box {...props} css={{ color: '$hiContrast', mb: '$3' }} as="ul" />,
  ol: (props) => <DS.Box {...props} css={{ color: '$hiContrast', mb: '$3' }} as="ol" />,
  li: (props) => (
    <li>
      <DS.Paragraph {...props} />
    </li>
  ),
  strong: (props) => (
    <DS.Text {...props} css={{ display: 'inline', fontSize: 'inherit', fontWeight: 500 }} />
  ),
  img: ({ ...props }) => (
    <DS.Box css={{ my: '$6' }}>
      <DS.Box
        as="img"
        {...props}
        css={{ maxWidth: '100%', verticalAlign: 'middle', ...props.css }}
      />
    </DS.Box>
  ),
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children, id, showLineNumbers = false, collapsed = false }) => {
    const isInlineCode = !className;

    if (isInlineCode) {
      return <DS.Code>{children}</DS.Code>;
    }

    const [isCollapsed, setIsCollapsed] = React.useState(collapsed);
    const collapsedStyles = {
      height: '100px',
      position: 'relative',
      '&::after': {
        content: `''`,
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'linear-gradient(to bottom, transparent 30%, $$background)',
      },
    };
    return (
      <Pre
        as="pre"
        css={{
          my: '$5',
          ...(isCollapsed ? (collapsedStyles as any) : {}),
          '[data-preview] + &': {
            marginTop: 1,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        }}
        className={className}
        id={id}
        data-line-numbers={showLineNumbers}
      >
        {isCollapsed && (
          <DS.Box
            css={{
              position: 'absolute',
              left: 0,
              zIndex: 1,
              bottom: '$2',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <DS.Button onClick={() => setIsCollapsed(false)}>
              <ChevronDownIcon /> Show code
            </DS.Button>
          </DS.Box>
        )}

        <code className={className} children={children} />
      </Pre>
    );
  },
  Image: ({ children, size, ...props }) => (
    <DS.Box as="figure" css={{ mx: '0', my: '$6' }}>
      <OffsetBox size={size}>
        <DS.Image
          {...props}
          css={{
            maxWidth: '100%',
            verticalAlign: 'middle',
          }}
        />
      </OffsetBox>
      <DS.Text
        as="figcaption"
        size="3"
        css={{
          lineHeight: '23px',
          color: '$slate11',
          mt: '$2',
        }}
      >
        {children}
      </DS.Text>
    </DS.Box>
  ),
  Video: ({
    small,
    large,
    src,
    children = '',
    muted = true,
    autoPlay = true,
    controls,
    size,
    ...props
  }) => (
    <DS.Box as="figure" css={{ mx: '0', my: '$6' }}>
      <OffsetBox size={size}>
        <video
          src={src}
          autoPlay={autoPlay}
          playsInline
          muted={muted}
          controls={controls}
          loop
          style={{ width: '100%', display: 'block' }}
        ></video>
      </OffsetBox>
      <DS.Text
        as="figcaption"
        size="3"
        css={{
          lineHeight: '23px',
          color: '$slate11',
          mt: '$2',
        }}
      >
        {children}
      </DS.Text>
    </DS.Box>
  ),
  blockquote: (props) => (
    <DS.Box
      css={{
        mt: '$6',
        mb: '$5',
        pl: '$4',
        borderLeft: `1px solid ${DS.theme.colors.gray6}`,
        color: 'orange',
        '& p': {
          fontSize: '$3',
          color: '$slate11',
          lineHeight: '25px',
        },
      }}
      {...props}
    />
  ),
  DemoButton,
  Preview: (props) => <Preview {...props} css={{ mt: '$5' }} />,
  RegisterLink: ({ id, index, href }) => {
    const isExternal = href.startsWith('http');

    React.useEffect(() => {
      const codeBlock = document.getElementById(id);
      if (!codeBlock) return;

      const allHighlightWords = codeBlock.querySelectorAll('.highlight-word');
      const target = allHighlightWords[index - 1];
      if (!target) return;

      const addClass = () => target.classList.add('on');
      const removeClass = () => target.classList.remove('on');
      const addClick = () => (isExternal ? window.location.replace(href) : NextRouter.push(href));

      target.addEventListener('mouseenter', addClass);
      target.addEventListener('mouseleave', removeClass);
      target.addEventListener('click', addClick);

      return () => {
        target.removeEventListener('mouseenter', addClass);
        target.removeEventListener('mouseleave', removeClass);
        target.removeEventListener('click', addClick);
      };
    }, []);

    return null;
  },
  H: ({ id, index, ...props }) => {
    const triggerRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
      const trigger = triggerRef.current;

      const codeBlock = document.getElementById(id);
      if (!codeBlock) return;

      const allHighlightWords = codeBlock.querySelectorAll('.highlight-word');
      const targetIndex = rangeParser(index).map((i) => i - 1);
      // exit if the `index` passed is bigger than the total number of highlighted words
      if (Math.max(...targetIndex) >= allHighlightWords.length) return;

      const addClass = () => targetIndex.forEach((i) => allHighlightWords[i].classList.add('on'));
      const removeClass = () =>
        targetIndex.forEach((i) => allHighlightWords[i].classList.remove('on'));

      trigger.addEventListener('mouseenter', addClass);
      trigger.addEventListener('mouseleave', removeClass);

      return () => {
        trigger.removeEventListener('mouseenter', addClass);
        trigger.removeEventListener('mouseleave', removeClass);
      };
    }, []);

    return <DS.Code css={{ cursor: 'default' }} ref={triggerRef} {...props} />;
  },
};

const OffsetBox = Box
// DS.styled('div', {
//   variants: {
//     size: {
//       wide: {
//         mx: '-$5',
//         '@bp4': { mx: '-$8' },
//       },
//       hero: {
//         mx: '-35px',
//         '@bp2': {
//           mx: '-90px',
//         },
//         '@bp3': {
//           mx: '-166px',
//         },
//       },
//     },
//   },
// });

const LinkHeading = ({
  id,
  children,
  css,
}: {
  id: string;
  children: React.ReactNode;
  css?: any;
}) => (
  <DS.Box css={{ ...css }}>
    <DS.Box
      as="a"
      href={`#${id}`}
      // used by `scrollToUrlHash`
      // not using the `id` attribute for that because we may get ids that start with a number
      // and that is not a valid css selector
      data-id={id}
      css={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',
        svg: {
          opacity: 0,
        },
        '&:hover svg': {
          opacity: 1,
        },
      }}
    >
      {children}
      <DS.Box as="span" css={{ ml: '$2', color: '$slate9' }}>
        <Link2Icon aria-hidden />
      </DS.Box>
    </DS.Box>
  </DS.Box>
);
