import { defineConfig } from 'tsup';

export default defineConfig({
  clean:true,
  dts:true,
  entry:['src/Label.js'],
  format:['cjs', 'esm', 'iife'],
  globalName:'httpui',
  minify:true,
  outExtension:args => {
    let format:string = args.format;

    if(format === 'iife')
      format = 'global';

    return { js:'.' + format + '.js' };
  },
  sourcemap:true,
  target:'esnext'
});
