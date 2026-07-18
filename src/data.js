/* ———— case studies ———— */

export const CASES = [
  {
    slug: 'meridian-estates',
    num: '01',
    client: 'Meridian Estates',
    field: 'WhatsApp Automation',
    metric: '3.4×',
    metricLabel: 'more qualified leads',
    summary:
      'A 40-agent brokerage drowning in unanswered DMs. Our WhatsApp agent now qualifies, scores and books viewings straight into their CRM — around the clock.',
    challenge:
      'Meridian ran paid campaigns that flooded WhatsApp with hundreds of enquiries a day. Agents answered between viewings; most leads waited hours and half never got a reply. The best prospects were indistinguishable from the tyre-kickers.',
    approach:
      'We forged a conversational agent fluent in their listings, pricing and financing options. It greets every enquiry in seconds, asks the qualifying questions a top closer would, scores intent, and books viewings directly into agent calendars — syncing every word to their CRM.',
    results: [
      '3.4× more qualified viewings booked per week',
      'First response time cut from 4 hours to 8 seconds',
      'Agents reclaimed ~15 hours a week for actual selling',
    ],
    stack: ['WhatsApp Business API', 'Claude', 'CRM Sync', 'Calendar Orchestration'],
  },
  {
    slug: 'northgate-clinics',
    num: '02',
    client: 'Northgate Clinics',
    field: 'Voice Agents',
    metric: '82%',
    metricLabel: 'of calls handled end-to-end',
    summary:
      'Front desks rang busy for hours a day. A branded voice agent now answers instantly, books and reschedules appointments, and escalates only what truly needs a human.',
    challenge:
      'Three clinics, one overwhelmed phone line each. Patients called to book, reschedule, ask about opening hours and prescriptions — and hit voicemail at peak times. Missed calls were missed revenue and, worse, missed care.',
    approach:
      'We deployed a voice agent with sub-second latency and natural interruption handling, tuned to sound like the clinic — warm, unhurried, precise. It authenticates patients, manages the appointment book, answers the forty most common questions and hands off edge cases with a full transcript.',
    results: [
      '82% of inbound calls resolved with no human involvement',
      'Zero missed calls during peak hours since launch',
      'Reception staff redeployed to in-clinic patient care',
    ],
    stack: ['Realtime Voice', 'Telephony Integration', 'EHR Booking', 'Escalation Flows'],
  },
  {
    slug: 'lumenpay',
    num: '03',
    client: 'LumenPay',
    field: 'AI-Powered SaaS',
    metric: '6 wks',
    metricLabel: 'from idea to paying users',
    summary:
      'A fintech founder with a napkin sketch. We shipped the full platform — auth, billing, analytics and an AI reconciliation engine at its core — in a month and a half.',
    challenge:
      'LumenPay’s founder had validated demand for AI-assisted invoice reconciliation but had no product, no team and a funding clock already ticking. Every week of build time was runway burned.',
    approach:
      'We ran our forge process: one week of product design sprints, then parallel tracks — scalable backend, usage-based billing, and the reconciliation engine that reads invoices, matches payments and explains every decision it makes. Weekly demos, no surprises.',
    results: [
      'MVP live with paying design partners in 6 weeks',
      '94% auto-match rate on real invoice data at launch',
      'Seed round closed on the strength of the working product',
    ],
    stack: ['Product Design', 'Scalable Backend', 'Usage Billing', 'Document AI'],
  },
]

/* ———— blog posts ———— */

export const POSTS = [
  {
    slug: 'whatsapp-agent-next-hire',
    date: 'July 2026',
    iso: '2026-07-06',
    tag: 'WhatsApp Automation',
    readTime: '5 min read',
    title: 'Why Your Next Hire Should Live Inside WhatsApp',
    excerpt:
      'Two billion people already have the app open. The businesses winning right now are the ones answering in eight seconds, not eight hours.',
    body: [
      { h: null, p: 'Every business we meet has the same graveyard: a WhatsApp inbox full of enquiries that were answered too late or never at all. Each one was a person with intent — money in hand, question half-typed — who moved on to whoever replied first.' },
      { h: 'Speed is the whole game', p: 'Research on lead response has said the same thing for a decade: reply within five minutes and your odds of qualifying a lead are dramatically higher than replying within an hour. On WhatsApp, expectations are even tighter — it is a chat app, and chat means now. No hiring plan gets a human to every message in eight seconds, twenty-four hours a day. An agent does that by default.' },
      { h: 'Not a chatbot — a colleague', p: 'The word "chatbot" earned its bad reputation: decision trees, canned answers, the dreaded "I didn’t understand that." Modern conversational agents are a different species. They read intent, hold context across days of conversation, consult your actual pricing and inventory, and know when to hand off to a human with a full summary instead of a cold transcript.' },
      { h: 'The compounding part', p: 'The underrated benefit is memory. Every conversation an agent handles becomes structured data: what people ask for, where they hesitate, which objections keep appearing. That intelligence flows back into your marketing and product decisions. Your inbox stops being a cost centre and becomes an instrument.' },
      { h: 'Where to start', p: 'Pick the one flow that hurts most — usually lead qualification or order support — and automate it end to end before touching anything else. A narrow agent that fully owns one job beats a broad one that half-does five. That first win funds the rest of the roadmap.' },
    ],
  },
  {
    slug: 'voice-agents-uncanny-valley',
    date: 'June 2026',
    iso: '2026-06-10',
    tag: 'Voice Agents',
    readTime: '6 min read',
    title: 'Voice Agents Have Quietly Crossed the Uncanny Valley',
    excerpt:
      'Sub-second latency and natural interruption handling changed everything. Most callers can no longer tell — and mostly, they no longer care.',
    body: [
      { h: null, p: 'For years, calling a company and hearing a robot meant one thing: mash zero and pray for a human. The technology deserved the reflex — high latency, brittle scripts, a voice that could not be interrupted without collapsing.' },
      { h: 'What actually changed', p: 'Three things arrived together: speech models that respond in under a second, voices with genuine prosody rather than text-to-speech flatness, and — most importantly — interruption handling. A caller can talk over the agent mid-sentence and it stops, listens, and adjusts, exactly like a person would. That last detail is what dissolves the uncanny valley; conversation is interruption.' },
      { h: 'The economics are absurd', p: 'A voice agent answers every call on the first ring, at 3 a.m. on a public holiday, in a consistent brand voice, and never has a bad day. For a clinic or brokerage, the maths is not "cheaper receptionist" — it is "zero missed calls", and every missed call was revenue you had already paid marketing money to generate.' },
      { h: 'Where humans stay', p: 'The goal is not replacing your team; it is refusing to waste them. Eighty percent of call volume is bookings, opening hours, and status checks. Route that to the agent, and the calls that reach a human are the ones that genuinely need judgement, empathy, or authority. Your callers get faster answers and your staff get better work.' },
      { h: 'The test that matters', p: 'Forget Turing. The commercial test is simpler: does the caller accomplish what they called for, quickly, without frustration? Modern agents pass it daily. The businesses adopting them are not early any more — they are on time. The ones waiting are late.' },
    ],
  },
  {
    slug: 'ai-saas-six-weeks',
    date: 'May 2026',
    iso: '2026-05-14',
    tag: 'AI-Powered SaaS',
    readTime: '7 min read',
    title: 'Shipping an AI SaaS in Six Weeks Without Burning Down',
    excerpt:
      'Speed is not recklessness — it is sequencing. The process we use to take founders from napkin sketch to paying users in a month and a half.',
    body: [
      { h: null, p: 'Six weeks from idea to paying users sounds like a growth-hack headline. It is actually the opposite: a boring, disciplined sequence that removes every decision that does not need to be made yet.' },
      { h: 'Week one is the product', p: 'We spend the first week refusing to write code. Design sprints, ruthless scope-cutting, and one question asked repeatedly: what is the single workflow a user would pay for this month? Everything else — the settings page, the second user role, the dashboard nobody asked for — goes on a list titled "after revenue."' },
      { h: 'The AI core is not a feature', p: 'Most "AI features" are a text box bolted onto a normal app, and users can tell. We build the intelligence into the core workflow — the thing the product does when it is doing its job. That is also why we build evaluation harnesses before we build UI: an AI product that cannot measure its own accuracy is a demo, not a business.' },
      { h: 'Boring infrastructure, deliberately', p: 'Managed database, managed auth, usage-based billing from a provider that has solved it, one cloud region. Every exotic infrastructure choice is a tax on your six weeks. The architecture should be interesting in exactly one place: the engine your competitors cannot copy-paste.' },
      { h: 'Demos over documents', p: 'Every Friday, the founder sees the real product with real data — never a slide deck. Weekly demos surface wrong assumptions while they are still cheap to fix and keep momentum honest. By week six there is no launch drama, because the product has already been "launched" to its harshest audience five times.' },
      { h: 'What six weeks buys you', p: 'Not a finished company — a working product, real usage data, and the credibility that comes from shipping. Fundraising conversations change entirely when the demo is a login page. That is the actual point of speed: it converts belief into evidence before the market moves on.' },
    ],
  },
]
