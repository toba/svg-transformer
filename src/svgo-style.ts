import SVGO from 'svgo';

/**
 * @see https://github.com/svg/svgo/blob/master/plugins/reusePaths.js
 */
export const inlineStylePlugin: SVGO.Plugin<SVGO.SyntaxTree, any> = {
   type: 'full',
   active: true,
   description: 'Convert stylesheet to element attributes',
   fn(ast, config = null): SVGO.SyntaxTree {
      return ast;
   }
};
