import SVGO from 'svgo';
import { stringLiteral } from '@babel/types';

export interface RuleGroup {
   selector: string;
   rules: Map<string, string>;
}

function applyStyleRules(el: SVGO.Element, rules: RuleGroup): SVGO.Element {
   rules.rules.forEach((value, key) => {
      if (!el.hasAttr(key)) {
         const attr = el.addAttr(key);
         attr.value = value;
      }
   });
   return el;
}

function traverse(
   item: SVGO.Item | SVGO.SyntaxTree,
   callback: (item: SVGO.Item) => void
) {
   if (item.isEmpty()) {
      return;
   }

   for (let child of item.content) {
      callback(child);
      traverse(child, callback);
   }
}

// .a{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round}"
export function parseCSS(css: string): RuleGroup {
   const selector = css.substring(0, css.indexOf('{'));
   const pairs = css
      .replace(selector, '')
      .replace(/[{}]/, '')
      .trim()
      .split(';');

   return {
      selector,
      rules: new Map<string, string>(
         pairs.map<[string, string]>(p => {
            const parts = p.split(':');
            return [parts[0].trim(), parts[1].trim()];
         })
      )
   };
}

/**
 * @see https://github.com/svg/svgo/blob/master/plugins/reusePaths.js
 */
export const inlineStylePlugin: SVGO.Plugin<SVGO.SyntaxTree, void> = {
   type: 'full',
   active: true,
   description: 'Convert stylesheet to element attributes',
   fn(ast): SVGO.SyntaxTree {
      const styles: RuleGroup[] = [];
      traverse(ast, item => {
         if (item.isElem('style') && !item.isEmpty()) {
            const content = item.content[0];
            if (content.hasOwnProperty('text')) {
               styles.push(parseCSS((content as SVGO.Text).text));
            }
         }
      });
      if (styles.length == 0) {
         return ast;
      }

      // TODO: iterate and build set of style rules then iterate again to
      // replace matching class names

      return ast;
   }
};
