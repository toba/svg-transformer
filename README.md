[![npm package](https://img.shields.io/npm/v/@toba/svg-transformer.svg)](https://www.npmjs.org/package/@toba/svg-transformer)
[![Build Status](https://travis-ci.org/toba/svg-transformer.svg?branch=master)](https://travis-ci.org/toba/svg-transformer)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![Dependencies](https://img.shields.io/david/toba/svg-transformer.svg)](https://david-dm.org/toba/svg-loader)
[![DevDependencies](https://img.shields.io/david/dev/toba/svg-transformer.svg)](https://david-dm.org/toba/svg-loader#info=devDependencies&view=list)
[![Test Coverage](https://codecov.io/gh/toba/svg-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/toba/svg-transformer)

<img src='https://toba.github.io/about/images/logo-colored.svg' width="100" align="right"/>

# SVG Transformer Webpack Plugin

## Installation

```sh
yarn add @toba/svg-transformer --dev

```

## Configuration

### Web

Webpack

```js
import { HtmlSvgPlugin } from '@toba/html-webpack-inline-svg';

export = {
  test: /.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
      options: {
        native: true,
      },
    },
  ],
}
```

### React Native

Based on [react-native-svg-transformer](https://github.com/kristerkari/react-native-svg-transformer#step-3-configure-the-react-native-packager)

Make sure that you have installed and linked `react-native-svg` library:

-  https://github.com/react-native-community/react-native-svg#installation

`metro.config.js`

```js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
   const {
      resolver: { sourceExts, assetExts }
   } = await getDefaultConfig();
   return {
      // https://facebook.github.io/metro/docs/en/configuration#babeltransformerpath
      transformer: {
         babelTransformerPath: require.resolve('@toba/svg-transformer')
      },
      resolver: {
         assetExts: assetExts.filter(ext => ext !== 'svg'),
         sourceExts: [...sourceExts, 'svg']
      }
   };
})();
```

or
`rn-cli.config.js`

```js
// https://github.com/facebook/metro/issues/176
module.exports = {
   transformModulePath: require.resolve('@toba/svg-transformer'),
   resolver: {
      sourceExts: ['svg']
   }
};
```

## Usage

Import your `.svg` file inside a React component:

```jsx
import LogoSVG from './logo.svg';
```

You can then use your image as a component:

```jsx
<LogoSVG width={120} height={40} />
```

## License

Copyright &copy; 2019 Jason Abbott

This software is licensed under the MIT license. See the [LICENSE](./LICENSE) file
accompanying this software for terms of use.
