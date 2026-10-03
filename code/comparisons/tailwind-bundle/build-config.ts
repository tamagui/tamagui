const excludeReact = process.env.BUNDLE_EXCLUDE_REACT === '1'
export const build = {
  outDir: excludeReact ? 'dist-no-react' : 'dist',
  sourcemap: 'hidden' as const,
  minify: true,
  rollupOptions: {
    external: excludeReact
      ? (id: string) => /^(react|react-dom)(\/|$)/.test(id) || id === 'scheduler'
      : [],
  },
}
