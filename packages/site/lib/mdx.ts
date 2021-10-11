import fs from 'fs';
import path from 'path';
import glob from 'glob';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { bundleMDX } from 'mdx-bundler';
import rehypeHighlightCode from '@lib/rehype-highlight-code';
import rehypeMetaAttribute from '@lib/rehype-meta-attribute';
import remarkSlug from 'remark-slug';

import type { Frontmatter } from 'types/frontmatter';

const ROOT_PATH = process.cwd();
export const DATA_PATH = path.join(ROOT_PATH, 'data');

// the front matter and content of all mdx files based on `docsPaths`
export const getAllFrontmatter = (fromPath) => {
  const PATH = path.join(DATA_PATH, fromPath);
  const paths = glob.sync(`${PATH}/**/*.mdx`);

  return paths.map((filePath) => {
    const source = fs.readFileSync(path.join(filePath), 'utf8');
    const { data, content } = matter(source);

    return {
      ...(data as Frontmatter),
      slug: path.basename(filePath).replace('.mdx', ''), // file name without extension
      wordCount: content.split(/\s+/g).length,
      readingTime: readingTime(content),
    } as Frontmatter;
  });
};

export const getMdxBySlug = async (basePath, slug) => {
  const source = fs.readFileSync(path.join(DATA_PATH, basePath, `${slug}.mdx`), 'utf8');
  const { frontmatter, code } = await bundleMDX(source, {
    xdmOptions(input, options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkSlug];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeMetaAttribute,
        rehypeHighlightCode,
      ];

      return options;
    },
  });

  return {
    frontmatter: {
      ...(frontmatter as Frontmatter),
      slug,
      wordCount: code.split(/\s+/g).length,
      readingTime: readingTime(code),
    } as Frontmatter,
    code,
  };
};
