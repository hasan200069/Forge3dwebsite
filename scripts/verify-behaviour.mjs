/* Behaviour checks in a real headless Chrome against the local server:
   hero demo controls, workflow decision, contact draft persistence,
   error clearing, submit timeout handling, service-page scrollspy and
   chunk-failure recovery. Prints one line per check.

     node scripts/verify-behaviour.mjs [baseUrl]

   Needs puppeteer-core (PUPPETEER_CORE=/path/to/puppeteer-core) and
   Google Chrome. Nothing is sent to the live form service: fetch is
   stubbed inside the page. */

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pc = require(process.env.PUPPETEER_CORE || 'puppeteer-core')
const BASE = process.argv[2] || 'http://localhost:4180'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const results = []
const check = (name, ok, detail = '') => {
  results.push(ok)
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`)
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await pc.launch({ executablePath: CHROME, headless: true })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  /* ———— hero demonstration ———— */
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  /* the home hero plays itself once on arrival; the checks below start
     from the finished state, so jump there first if it is still running */
  await sleep(1600)
  let r = await page.evaluate(() => ({ status: document.querySelector('.flow .demo-status')?.textContent }))
  check('hero example plays itself once on arrival', r.status === 'Playing' || r.status === 'Complete', JSON.stringify(r))
  await page.evaluate(() => [...document.querySelectorAll('.flow .demo-controls button')].find((b) => /Show result/.test(b.textContent))?.click())
  await sleep(200)
  r = await page.evaluate(() => ({
    visible: document.querySelectorAll('.flow .bubble:not(.pending):not(.typing)').length,
    total: document.querySelectorAll('.flow .bubble:not(.typing)').length,
    done: document.querySelectorAll('.flow-step.done').length,
    playBtn: !!document.querySelector('.flow .demo-controls button'),
    layoutH: document.querySelector('.flow .chat').offsetHeight,
  }))
  check('hero shows the complete example before playback', r.visible === 7 && r.total === 7 && r.done === 4, JSON.stringify(r))
  const h0 = r.layoutH
  const clickHero = () => page.evaluate(() => document.querySelector('.flow .demo-controls button').click())
  await clickHero()
  await sleep(300)
  r = await page.evaluate(() => ({
    visible: document.querySelectorAll('.flow .bubble:not(.pending):not(.typing)').length,
    typing: !!document.querySelector('.flow .bubble.typing'),
    status: document.querySelector('.flow .demo-status').textContent,
    layoutH: document.querySelector('.flow .chat').offsetHeight,
    pauseBtn: document.querySelector('.flow .demo-controls button').textContent.trim(),
  }))
  check('play restarts from an empty conversation with a typing indicator', r.visible === 0 && r.typing && r.status === 'Playing', JSON.stringify(r))
  check('playback does not change the layout height', Math.abs(r.layoutH - h0) < 1, `${h0} vs ${r.layoutH}`)
  await clickHero() // pause
  await sleep(200)
  r = await page.evaluate(() => ({ status: document.querySelector('.flow .demo-status').textContent, btn: document.querySelector('.flow .demo-controls button').textContent.trim() }))
  check('pause works', r.status === 'Paused' && /Play|Replay/.test(r.btn), JSON.stringify(r))
  await clickHero() // resume
  await sleep(4200)
  r = await page.evaluate(() => ({
    visible: document.querySelectorAll('.flow .bubble:not(.pending):not(.typing)').length,
    done: document.querySelectorAll('.flow-step.done').length,
    live: document.querySelector('.flow-step.live')?.textContent.slice(0, 20),
  }))
  check('stages advance only with matching messages', r.visible >= 2 && r.done <= Math.max(1, r.visible - 1), JSON.stringify(r))
  await page.evaluate(() => [...document.querySelectorAll('.flow .demo-controls button')].find((b) => /Show result/.test(b.textContent))?.click())
  await sleep(200)
  r = await page.evaluate(() => ({ visible: document.querySelectorAll('.flow .bubble:not(.pending):not(.typing)').length, done: document.querySelectorAll('.flow-step.done').length, status: document.querySelector('.flow .demo-status').textContent }))
  check('"Show result" jumps to the complete, booked state', r.visible === 7 && r.done === 4 && r.status === 'Complete', JSON.stringify(r))

  /* ———— workflow decision ———— */
  await page.evaluate(() => document.querySelector('.wf')?.scrollIntoView({ block: 'center' }))
  await sleep(300)
  await page.evaluate(() => [...document.querySelectorAll('.wf .demo-controls button')].find((b) => /Play/.test(b.textContent))?.click())
  await sleep(5200)
  r = await page.evaluate(() => ({ choice: !!document.querySelector('.wf-choice'), status: document.querySelector('.wf .demo-status')?.textContent }))
  check('workflow stops at the human decision and waits', r.choice && /decision/.test(r.status), JSON.stringify(r))
  await page.evaluate(() => [...document.querySelectorAll('.wf-choice button')].find((b) => /Query/.test(b.textContent))?.click())
  await sleep(200)
  r = await page.evaluate(() => ({ held: !!document.querySelector('.wf-node.held'), text: document.querySelector('.wf-node.held')?.textContent.slice(0, 40) }))
  check('"Query it" shows the held-invoice branch', r.held, JSON.stringify(r))

  /* ———— contact: draft persistence, error clearing, timeout ———— */
  await page.goto(BASE + '/contact', { waitUntil: 'networkidle0' })
  await page.type('#cf-name', 'Draft Person')
  await page.type('#cf-message', 'This is a draft that should survive a visit to the privacy policy.')
  r = await page.evaluate(() => ({ target: document.querySelector('.form-note a[href="/privacy"]')?.getAttribute('target') }))
  check('privacy link opens in a new tab', r.target === '_blank', JSON.stringify(r))
  await page.goto(BASE + '/privacy', { waitUntil: 'networkidle0' })
  await page.goBack({ waitUntil: 'networkidle0' })
  await sleep(300)
  r = await page.evaluate(() => ({ name: document.querySelector('#cf-name').value, msg: document.querySelector('#cf-message').value }))
  check('draft survives leaving and coming back', r.name === 'Draft Person' && r.msg.startsWith('This is a draft'), JSON.stringify(r))

  await page.click('.contact-form button[type=submit]')
  await sleep(200)
  r = await page.evaluate(() => ({ nameErr: document.querySelector('#cf-name-err')?.textContent, emailErr: document.querySelector('#cf-email-err')?.textContent, focus: document.activeElement.id }))
  check('empty required field shows an error and gets focus', r.emailErr && r.focus === 'cf-email', JSON.stringify(r))
  await page.type('#cf-email', 'draft@example.com')
  await sleep(100)
  r = await page.evaluate(() => ({ emailErr: document.querySelector('#cf-email-err')?.textContent ?? null, invalid: document.querySelector('#cf-email').getAttribute('aria-invalid') }))
  check('correcting the field clears its error immediately', r.emailErr === null && r.invalid === 'false', JSON.stringify(r))

  // stub a stalled network: fetch never resolves unless aborted
  await page.evaluate(() => { window.fetch = (u, o) => new Promise((_, rej) => o.signal.addEventListener('abort', () => rej(Object.assign(new Error('aborted'), { name: 'AbortError' })))) })
  await page.evaluate(() => { document.querySelector('.contact-form button[type=submit]').click() })
  await sleep(400)
  r = await page.evaluate(() => ({ busy: document.querySelector('.contact-form').getAttribute('aria-busy'), btn: document.querySelector('.contact-form button[type=submit]').textContent.trim(), spinner: !!document.querySelector('.spinner') }))
  check('submission shows a busy state', r.busy === 'true' && /Sending/.test(r.btn) && r.spinner, JSON.stringify(r))
  await sleep(15500)
  r = await page.evaluate(() => ({ status: document.querySelector('.form-status')?.textContent, kept: document.querySelector('#cf-message').value.startsWith('This is a draft'), focus: document.activeElement.className }))
  check('a stalled request times out with a retry message and keeps the text', /15 seconds/.test(r.status || '') && r.kept, JSON.stringify(r))

  // stub success and confirm focus lands on the success heading
  await page.evaluate(() => { window.fetch = async () => new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } }) })
  await page.evaluate(() => { document.querySelector('.contact-form button[type=submit]').click() })
  await sleep(600)
  r = await page.evaluate(() => ({ sent: !!document.querySelector('.form-sent'), focus: document.activeElement.tagName + ':' + document.activeElement.textContent.slice(0, 30), draft: sessionStorage.getItem('fq-enquiry-draft') }))
  check('success moves focus to the success heading and clears the draft', r.sent && r.focus.startsWith('H2:') && r.draft === null, JSON.stringify(r))

  /* ———— service page scrollspy ———— */
  await page.goto(BASE + '/services/ai-reception', { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.getElementById('integrations').scrollIntoView())
  await sleep(1400) // the page scrolls smoothly
  r = await page.evaluate(() => ({ current: document.querySelector('.svc-nav a[aria-current="location"]')?.getAttribute('href'), focus: document.activeElement.tagName }))
  check('in-page nav marks the section in view without moving focus', r.current === '#integrations' && r.focus === 'BODY', JSON.stringify(r))

  /* ———— chunk failure recovery ———— */
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await page.setRequestInterception(true)
  let blocked = 0
  page.on('request', (req) => {
    if (/\/assets\/About-.*\.js$/.test(req.url()) && blocked === 0) { blocked++; req.abort() } else req.continue()
  })
  await page.click('.nav-links a[href="/about"]')
  await sleep(2500)
  r = await page.evaluate(() => ({ path: location.pathname, h1: document.querySelector('h1')?.textContent.slice(0, 30), guard: sessionStorage.getItem('fq-chunk-reload') }))
  check('a failed chunk load recovers with a full reload of the target page', r.path === '/about' && /engineer-led/.test(r.h1 || '') && r.guard === null, JSON.stringify(r))
} finally {
  await browser.close()
}

const failed = results.filter((x) => !x).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
