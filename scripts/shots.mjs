/* Full-page screenshots through a real headless Chrome, scrolling first
   so IntersectionObserver-driven reveals fire the way they do for a
   visitor. Used for visual checks; not part of the build.

     node scripts/shots.mjs <outDir> [baseUrl]

   Needs puppeteer-core (present in the npx cache after a Lighthouse
   run) and Google Chrome. */

import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const require = createRequire(process.argv[3] || import.meta.url)
const pc = require(process.env.PUPPETEER_CORE || 'puppeteer-core')

const OUT = process.argv[2]
const BASE = process.argv[4] || 'http://localhost:4180'
mkdirSync(OUT, { recursive: true })

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SHOTS = [
  ['home-desktop', 1280, 800, '/'],
  ['home-mobile', 390, 844, '/'],
  ['services-desktop', 1280, 800, '/services'],
  ['reception-mobile', 390, 844, '/services/ai-reception'],
  ['work-desktop', 1280, 800, '/case-studies'],
  ['contact-mobile', 390, 844, '/contact'],
  ['about-desktop', 1280, 800, '/about'],
  ['voice-desktop', 1280, 800, '/services/voice-agents'],
  ['blog-mobile', 390, 844, '/blog'],
]

const browser = await pc.launch({ executablePath: CHROME, headless: true, args: ['--no-first-run', '--hide-scrollbars'] })
try {
  for (const [name, w, h, path] of SHOTS) {
    const page = await browser.newPage()
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
    await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 30000 })
    // scroll through the page in viewport-sized steps so every reveal fires
    await page.evaluate(async () => {
      const total = document.documentElement.scrollHeight
      for (let y = 0; y < total; y += window.innerHeight * 0.8) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 380))
      }
      window.scrollTo(0, 0)
      await new Promise((r) => setTimeout(r, 900))
    })
    const stats = await page.evaluate(() => ({
      reveal: document.querySelectorAll('.reveal').length,
      revealed: document.querySelectorAll('.reveal.in').length,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
    }))
    await page.screenshot({ path: join(OUT, `shot-${name}.png`), fullPage: true })
    console.log(name, JSON.stringify(stats))
    await page.close()
  }
} finally {
  await browser.close()
}
