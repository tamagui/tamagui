import '@docsearch/css'

import type { DocSearchModalProps } from '@docsearch/react'
import { DocSearchModal } from '@docsearch/react'
import Head from 'next/head'

export default function DocSearch(props: DocSearchModalProps) {
  return (
    <>
      <Head>
        <style>{docSearchCSS}</style>
      </Head>
      <DocSearchModal {...props} />
    </>
  )
}

const docSearchCSS = `
:root{
.DocSearch {
  --docsearch-primary-color: var(--colorPress);
  --docsearch-highlight-color: var(--color);
  --docsearch-text-color: var(--colorHover);
  --docsearch-modal-background: var(--background);
  --docsearch-searchbox-shadow: none;
  --docsearch-searchbox-background: transparent;
  --docsearch-searchbox-focus-background: transparent;
  --docsearch-hit-color: var(--colorHover);
  --docsearch-muted-color: var(--colorFocus);
  --docsearch-logo-color: var(--colorPress);
  --docsearch-footer-background: transparent;
  --docsearch-footer-shadow: none;
  --docsearch-modal-shadow: inset 0 0 1px 1px var(--borderColor), 0 5px 20px 0 var(--shadowColor);
  z-index: 10000000;
}

.DocSearch-Container {
  background-color: var(--background075)
}

.DocSearch-Modal {
  background-color: var(--color2);
}

.DocSearch-Hit a {
  background: var(--background);
}

.DocSearch-Hit[aria-selected=true] a {
  background: var(--backgroundPress);
}

.DocSearch-Modal {
  border-radius: 10px;
}

.DocSearch-SearchBar {
  border-bottom: 0.5px solid var(--borderColor);
  padding-left: var(--space-1);
  padding-right: var(--space-1);
  padding-top: var(--space-2);
  padding-bottom: var(--space-2);
  font-size: var(--size-3);
}

@media (max-width: 750px) {
  .DocSearch-Modal {
    margin: 10px;
    width: auto;
    height: auto;
    flex: 1;
  }
}

.DocSearch-Cancel {
  font-size: 12px;
  padding: 20px;
  opacity: 0.5;
  margin-right: var(--space-2)
}

.DocSearch-Container {
  backdrop-filter: blur(5px);
}

.DocSearch-Label,
.DocSearch-Help,
.DocSearch-NoResults,
.DocSearch-Footer,
.DocSearch-Reset {
  color: var(--color9);
}

.DocSearch-Input {
  font-size: 16px;
}

.DocSearch-Commands {
  display: none;
}

.DocSearch-MagnifierLabel {
  opacity: 0.2;
  margin-right: 10px;
}

.t_dark .DocSearch {
  --docsearch-container-background: rgba(25, 25, 25, 0.6);
  --docsearch-hit-shadow: none;
  --docsearch-hit-background: #333;
  --docsearch-key-gradient: linear-gradient(-26.5deg, #161618, #4a4a4a);
}
`
