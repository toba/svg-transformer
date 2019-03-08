import SVGO from 'svgo';
import { camelize, is } from '@toba/node-tools';

export interface RuleGroup {
   selector: string;
   rules: Map<string, string>;
}

function applyStyleRules(el: SVGO.Element, style?: RuleGroup): void {
   if (style !== undefined) {
      style.rules.forEach((value, key) => {
         const name = camelize(key);
         if (!el.hasAttr(name)) {
            el.addAttr({ name, local: name, prefix: '', value });
         }
      });
   }
}

/**
 * Execute callback for each syntax tree item.
 */
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

export function parseCSS(css: string): RuleGroup[] | null {
   if (is.empty(css)) {
      return null;
   }
   const styles: RuleGroup[] = [];
   const re = /([^{}]+)\s*{([^{}]+)}/g;
   let match: RegExpExecArray | null;

   while ((match = re.exec(css)) !== null) {
      const pairs = match[2].trim().split(';');

      styles.push({
         selector: match[1],
         rules: new Map<string, string>(
            pairs.map<[string, string]>(p => {
               const parts = p.split(':');
               return [parts[0].trim(), parts[1].trim()];
            })
         )
      });
   }

   return styles.length == 0 ? null : styles;
}

/**
 * SVGO plugin that inlines style sheets.
 * @see https://github.com/svg/svgo/blob/master/plugins/reusePaths.js
 */
export const inlineStylePlugin: SVGO.Plugin<SVGO.SyntaxTree, void> = {
   type: 'full',
   active: true,
   description: 'Convert stylesheet to element attributes',
   fn(ast): SVGO.SyntaxTree {
      const styles: RuleGroup[] = [];

      // find all style classes
      traverse(ast, item => {
         if (item.isElem('style') && !item.isEmpty()) {
            const content = item.content[0];
            if (content.hasOwnProperty('text')) {
               const groups = parseCSS((content as SVGO.Text).text);
               if (groups !== null) {
                  styles.push(...groups);
               }
            }
         }
      });
      if (styles.length == 0) {
         return ast;
      }

      // convert CSS rules to attributes for any elements using the style class
      traverse(ast, item => {
         if (item.hasAttr('class')) {
            applyStyleRules(
               item as SVGO.Element,
               styles.find(s => s.selector == '.' + item.attr('class').value)
            );
            item.removeAttr('class');
         }
      });

      return ast;
   }
};
