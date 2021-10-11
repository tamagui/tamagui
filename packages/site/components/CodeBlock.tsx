// Inspired by https://github.com/rexxars/react-refractor
import React from 'react';
import refractor from 'refractor/core';
import js from 'refractor/lang/javascript';
import jsx from 'refractor/lang/jsx';
import bash from 'refractor/lang/bash';
import css from 'refractor/lang/css';
import diff from 'refractor/lang/diff';
import hastToHtml from 'hast-util-to-html';
import rangeParser from 'parse-numeric-range';
import highlightLine from '@lib/rehype-highlight-line';
import highlightWord from '@lib/rehype-highlight-word';
import { Pre } from './Pre';

refractor.register(js);
refractor.register(jsx);
refractor.register(bash);
refractor.register(css);
refractor.register(diff);

type PreProps = Omit<React.ComponentProps<typeof Pre>, 'css'>;

type CodeBlockProps = PreProps & {
  language: 'js' | 'jsx' | 'bash' | 'css' | 'diff';
  value: string;
  line?: string;
  css?: any;
  mode?: 'static' | 'typewriter' | 'interactive';
  showLineNumbers?: boolean;
};

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (_props, forwardedRef) => {
    const {
      language,
      value,
      line = '0',
      className = '',
      mode,
      css,
      variant,
      showLineNumbers,
      ...props
    } = _props;
    let result = refractor.highlight(value, language);

    result = highlightLine(result, rangeParser(line));

    result = highlightWord(result);

    // convert to html
    result = hastToHtml(result);

    // TODO reset theme

    const classes = `language-${language} ${className}`;

    if (mode === 'typewriter') {
      return (
        <CodeTypewriter className={classes} css={css} variant={variant} value={result} {...props} />
      );
    }

    return (
      <Pre
        ref={forwardedRef}
        className={classes}
        css={css}
        variant={variant}
        data-line-numbers={showLineNumbers}
        {...props}
      >
        <code className={classes} dangerouslySetInnerHTML={{ __html: result }} />
      </Pre>
    );
  }
);

/**
 * recursively get all text nodes as an array for a given element
 */
function getTextNodes(node) {
  let childTextNodes = [];

  if (!node.hasChildNodes()) return;

  const childNodes = node.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeType == Node.TEXT_NODE) {
      childTextNodes.push(childNodes[i]);
    } else if (childNodes[i].nodeType == Node.ELEMENT_NODE) {
      Array.prototype.push.apply(childTextNodes, getTextNodes(childNodes[i]));
    }
  }

  return childTextNodes;
}

/**
 * given a text node, wrap each character in the
 * given tag.
 */
function wrapEachCharacter(textNode, tag, count) {
  const text = textNode.nodeValue;
  const parent = textNode.parentNode;

  const characters = text.split('');
  characters.forEach(function (character, letterIndex) {
    const delay = (count + letterIndex) * 50;
    var element = document.createElement(tag);
    var characterNode = document.createTextNode(character);
    element.appendChild(characterNode);
    element.style.opacity = 0;
    element.style.transition = `all ease 0ms ${delay}ms`;

    parent.insertBefore(element, textNode);

    // skip a couple of frames to trigger transition
    requestAnimationFrame(() => requestAnimationFrame(() => (element.style.opacity = 1)));
  });

  parent.removeChild(textNode);
}

function CodeTypewriter({ value, className, css, variant, ...props }) {
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    const wrapper = wrapperRef.current;

    if (wrapper) {
      var allTextNodes = getTextNodes(wrapper);

      let count = 0;
      allTextNodes.forEach((textNode) => {
        wrapEachCharacter(textNode, 'span', count);
        count = count + textNode.nodeValue.length;
      });
      wrapper.style.opacity = 1;
    }

    return () => (wrapper.innerHTML = value);
  }, []);

  return (
    <Pre className={className} css={css} variant={variant} {...props}>
      <code
        ref={wrapperRef}
        style={{ opacity: 0 }}
        className={className}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </Pre>
  );
}
