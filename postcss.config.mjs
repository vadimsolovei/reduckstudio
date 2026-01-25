import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import cssnano from 'cssnano';

export default {
  plugins: [
    postcssImport(),
    postcssNesting(),
    ...(process.env.NODE_ENV === 'production'
      ? [cssnano({ preset: 'default' })]
      : []),
  ],
};
