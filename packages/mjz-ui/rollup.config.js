
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const config = {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: 'index.js',
    intro: 'import "./index.css"'
  },
  plugins: [
    typescript(),
    postcss({
      extensions: ['.less', '.css'],
      extract: true,
    }),
    commonjs(),

    // 模块加载
    resolve({
      browser: true,
      jsnext: true,
      main: true,
    }),
  ],
  external: ['react', 'react-dom'],
  watch: {
    include: 'src/**'
  }
};

export default config;
