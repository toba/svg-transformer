import '@toba/test';
import path from 'path';
import { readFileText } from '@toba/test';
import { transform, svgToJSX, SvgoPlugin } from './index';

let logoSVG = '';
let gaugeSVG = '';

const readSVG = (name: string) =>
   readFileText(path.resolve(__dirname, '__mocks__', name + '.svg'));

beforeAll(async () => {
   logoSVG = await readSVG('logo-colored');
   gaugeSVG = await readSVG('gauge-dashboard');
});

test('uses SVGO to prepare SVG', () => {
   const logoJSX = SvgoPlugin(logoSVG, { svgo: true });
   const gaugeJSX = SvgoPlugin(gaugeSVG, { svgo: true });

   ['xmlns:bx', 'xmlns', 'style=', 'id="pleaseRemove"', '<style>'].forEach(
      nope => {
         expect(logoJSX.includes(nope)).toBe(false);
         expect(gaugeJSX.includes(nope)).toBe(false);
      }
   );

   expect(logoJSX).toMatchSnapshot();
   expect(gaugeJSX).toMatchSnapshot();
});

test('converts SVG to a JSX component', () => {
   const jsx = svgToJSX(logoSVG);

   ["React from 'react'"].forEach(yep => {
      expect(jsx.includes(yep)).toBe(true);
   });
   expect(jsx).toMatchSnapshot();
});

// https://github.com/smooth-code/svgr/blob/e3009cb37037e828c3f5360b42ad351fa51222e9/packages/babel-plugin-transform-logoSVG-component/src/index.test.js
test('creates module for SVG file', async () => {
   const out = await transform(logoSVG, 'logo-colored.svg');

   expect(out).toBeDefined();
   expect(out.ast).toBeDefined();
   //expect(out.).toMatchSnapshot();
});
