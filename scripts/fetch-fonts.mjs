/* Pulls the latin + latin-ext woff2 subsets out of Google Fonts into
   public/fonts/ and writes the matching @font-face sheet to src/fonts.css.

   Self-hosting removes two third-party connections from the critical
   path. Run via `npm run fonts`; the output is committed. */

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'fonts')
mkdirSync(OUT, { recursive: true })

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const HREF =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300..700&display=swap'

const css = await (await fetch(HREF, { headers: { 'User-Agent': UA } })).text()

// split on the /* subset */ comments Google emits before each @font-face
const blocks = css
  .split(/\/\*\s*([a-z-]+)\s*\*\//)
  .slice(1)
  .reduce((acc, part, i, arr) => {
    if (i % 2 === 0) acc.push({ subset: part, body: arr[i + 1] })
    return acc
  }, [])

const keep = blocks.filter((b) => b.subset === 'latin' || b.subset === 'latin-ext')

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')
const out = []

for (const { subset, body } of keep) {
  const family = /font-family: '([^']+)'/.exec(body)[1]
  const weight = /font-weight: ([\d ]+);/.exec(body)[1].trim() // "400" or a variable range "200 900"
  const style = /font-style: (\w+)/.exec(body)[1]
  const url = /src: url\(([^)]+)\)/.exec(body)[1]
  const range = /unicode-range: ([^;]+);/.exec(body)[1]

  const name = `${slug(family)}-${slug(weight)}${style === 'italic' ? 'i' : ''}-${subset}.woff2`
  const bin = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer())
  writeFileSync(join(OUT, name), bin)

  out.push(
    `@font-face {\n` +
      `  font-family: '${family}';\n` +
      `  font-style: ${style};\n` +
      `  font-weight: ${weight};\n` +
      `  font-display: swap;\n` +
      `  src: url('/fonts/${name}') format('woff2');\n` +
      `  unicode-range: ${range};\n` +
      `}`
  )
  console.log(`${name}  ${(bin.length / 1024).toFixed(1)} kB`)
}

writeFileSync(join(ROOT, 'src', 'fonts.css'), `/* self-hosted subsets — generated, do not edit */\n\n${out.join('\n\n')}\n`)
console.log(`\nwrote ${keep.length} faces`)
