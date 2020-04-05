import '@toba/test'
import { parseCSS } from './svgo-style'

test('parses CSS string', () => {
   const css =
      '.a{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round}'
   const groups = parseCSS(css)

   expect(groups).toBeDefined()
   expect(groups).toHaveLength(1)

   const g = groups[0]
   expect(g.selector).toBe('.a')
   expect(g.rules.size).toBe(4)
   expect(g.rules.has('fill')).toBe(true)
   expect(g.rules.get('stroke')).toBe('#000')

   expect(parseCSS('')).toBeNull()
   expect(parseCSS('junk')).toBeNull()
})
