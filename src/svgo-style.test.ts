import '@toba/test';
import { parseCSS } from './svgo-style';

test('parses CSS string', () => {
   const css =
      '.a{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round}';
   const group = parseCSS(css);

   expect(group).toBeDefined();
   expect(group.selector).toBe('.a');
   expect(group.rules.size).toBe(4);
   expect(group.rules.has('fill')).toBe(true);
   expect(group.rules.get('stroke')).toBe('#000');
});
