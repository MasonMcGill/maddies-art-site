import del from 'del';
import fs from 'fs-extra';
import gulp from 'gulp';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';

async function compileUi() {
  const rollupPlugins = [
    resolve({ extensions: ['.js', '.ts'] }),
    sucrase({ exclude: ['node_modules/**'], transforms: ['typescript'] })
  ];
  const bundle = await rollup({
    input: 'source/ui/main.ts',
    plugins: rollupPlugins
  });
  await bundle.write({
    file: 'site/ui.js',
    name: 'ui',
    format: 'iife',
    sourcemap: true
  });
}

async function copyFonts() {
  await fs.copy('node_modules/@fontsource', 'site/fonts');
}

async function copyAsset(name) {
  await fs.copy(`source/${name}`, `site/${name}`);
}

export async function build() {
  await fs.copy('source/index.html', 'site/index.html');
  await fs.copy('source/theme.css', 'site/theme.css');
  await fs.copy('source/images', 'site/images');
  await copyFonts();
  await compileUi();
}

export async function watch() {
  await build();
  gulp.watch('source/index.html', () => copyAsset('index.html'));
  gulp.watch('source/theme.css', () => copyAsset('theme.css'));
  gulp.watch('source/images/**', () => copyAsset('images'));
  gulp.watch('node_modules/@fontsource', copyFonts);
  gulp.watch('source/ui/**', compileUi);
}

export async function clean() {
  await del('site/**');
}
