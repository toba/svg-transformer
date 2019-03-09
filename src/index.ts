import SVGO from 'svgo';
import svgr from '@svgr/core';
import { convertStyleDefToAttrs } from './svgo-style';
import { TransformOptions, BabelFileResult } from '@babel/core';

/**
 * SVGR plugin to run SVGO with custom configuration.
 */
export const SvgoPlugin: svgr.Plugin = src => {
   /**
    * SVGO plugin configurations.
    * @see https://github.com/svg/svgo#what-it-can-do
    */
   const plugins: { [key: string]: string | boolean | object } = {
      removeXMLNS: true,
      // https://github.com/svg/svgo/blob/master/plugins/removeEditorsNSData.js
      removeEditorsNSData: {
         additionalNamespaces: ['https://boxy-svg.com']
      },
      removeAttrs: {
         attrs: ['id']
      },
      removeDimensions: true,
      convertStyleToAttrs: true
   };
   const svgo = new SVGO({
      plugins: [
         {
            convertStyleDefToAttrs
         },
         ...Object.keys(plugins).map(key => ({ [key]: plugins[key] } as any))
      ]
   });

   let out = '';

   // use private method because it is synchronous
   svgo._optimizeOnce(src, null, (svg: SVGO.OptimizedSvg) => {
      out = svg.data;
   });

   return out;
};

/**
 * Use SVGR to convert SVG source to JSX using a custom SVGO and template
 * configuration.
 */
export const svgToJSX = (svg: string, native = false) =>
   svgr.sync(svg, {
      native,
      svgo: true,
      plugins: [SvgoPlugin, '@svgr/plugin-jsx', '@svgr/plugin-prettier']
   });

/**
 * Babel transformer that runs SVGO for all content from a file name ending
 * with `.svg` then uses SVGR to convert the result to a React Component.
 *
 * This is meant to be equivalent to `react-native-svg-transformer` but with
 * different SVGO and template configuration.
 *
 * @see https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
 * @see https://github.com/facebook/metro/blob/master/packages/metro/src/JSTransformer/worker.js
 */
export async function transform(
   src: string | { src: string; filename: string; options?: TransformOptions },
   filename: string,
   options?: TransformOptions
): Promise<BabelFileResult> {
   if (typeof src === 'object') {
      // handle RN >= 0.46
      ({ src, filename, options } = src);
   }

   if (options === undefined) {
      options = {};
   }

   //import metroBabel from 'metro-react-native-babel-transformer';
   const metroTransform = await import('metro/src/reactNativeTransformer');

   return filename.endsWith('.svg')
      ? metroTransform.transform({
           src: svgToJSX(src),
           filename,
           options
        })
      : metroTransform.transform({ src, filename, options });
}
