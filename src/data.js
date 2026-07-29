/* ————————————————————————————————————————
   Site content. Single source of truth — the home journey, the services
   page, the prerenderer and the sitemap all read from here, so copy can
   never drift between a page and the metadata describing it.
   ———————————————————————————————————————— */

/* ———— services ———— */

export const SERVICES = [
  {
    num: '01',
    cat: 'Conversational Infrastructure',
    lead: 'WhatsApp',
    accent: 'Automation',
    title: 'WhatsApp Automation',
    interest: 'WhatsApp Automation',
    short:
      'Two billion people live inside WhatsApp. We forge intelligent pipelines that live there with them — qualifying leads, closing sales, resolving support and remembering every conversation, around the clock.',
    long:
      'Two billion people live inside WhatsApp — and they expect answers in seconds, not hours. We build intelligent WhatsApp agents on the official Business API that qualify leads, close sales, resolve support tickets and remember every conversation, twenty-four hours a day. Every message syncs to your CRM, every hot lead gets escalated, and nothing ever sits unanswered overnight.',
    tags: ['Lead Qualification', 'AI Sales Flows', 'Support Desks', 'Broadcast Engines', 'CRM Sync'],
  },
  {
    num: '02',
    cat: 'Audio Intelligence',
    lead: 'Voice',
    accent: 'Agents',
    title: 'Voice Agents',
    interest: 'Voice Agents',
    short:
      'Agents that pick up the phone. Sub-second latency, natural interruption handling, and a voice tuned to your brand — booking appointments, screening calls and running outbound campaigns while you sleep.',
    long:
      'AI agents that pick up the phone. Sub-second latency, natural interruption handling, and a voice tuned to your brand — booking appointments, screening calls, replacing brittle IVR menus and running outbound campaigns while you sleep. Edge cases hand off to a human with a full transcript, so nobody ever repeats themselves.',
    tags: ['Inbound Reception', 'Outbound Campaigns', 'Appointment Booking', 'IVR Replacement', 'Call Analytics'],
  },
  {
    num: '03',
    cat: 'Embodied Presence',
    lead: 'Avatar',
    accent: 'Agents',
    title: 'Avatar Agents',
    interest: 'Avatar Agents',
    short:
      'A face for your intelligence. Photoreal and stylised avatars that speak, emote and hold eye contact — greeting visitors, training teams and presenting products with human warmth at machine scale.',
    long:
      'A face for your intelligence. Photoreal and stylised digital avatars that speak, emote and hold eye contact — greeting website visitors, onboarding customers, training teams and presenting products with human warmth at machine scale. Real-time lip-sync, brand-matched personas, and scripts that adapt to the person watching.',
    tags: ['Digital Receptionists', 'Video Concierges', 'Training Personas', 'Lip-Sync Engines', 'Brand Characters'],
  },
  {
    num: '04',
    cat: 'Bespoke Cognition',
    lead: 'Custom',
    accent: 'Agents',
    title: 'Custom AI Agents',
    interest: 'Custom Agents',
    short:
      'When off-the-shelf thinks off-the-shelf. We design agents around your exact workflows — multi-step reasoning, tool use, retrieval over your private knowledge — orchestrated swarms that run your operations.',
    long:
      'When off-the-shelf thinks off-the-shelf. We design agents around your exact workflows: multi-step reasoning, tool use, retrieval over your private knowledge, and orchestrated multi-agent swarms that run entire operations. Built model-agnostic, deployed on your infrastructure or ours, with evaluation harnesses so you can trust what ships.',
    tags: ['Agentic Workflows', 'RAG Pipelines', 'Tool Orchestration', 'Multi-Agent Swarms', 'Fine-Tuning'],
  },
  {
    num: '05',
    cat: 'Product Engineering',
    lead: 'AI-Powered',
    accent: 'SaaS',
    title: 'AI-Powered SaaS',
    interest: 'AI-Powered SaaS',
    short:
      'From napkin sketch to paying subscribers. We architect, design and ship full SaaS platforms with intelligence in their core — billing, auth, analytics and an AI engine your competitors can’t copy-paste.',
    long:
      'From napkin sketch to paying subscribers. We architect, design and ship complete SaaS platforms with intelligence at the core — authentication, usage-based billing, analytics and an AI engine your competitors cannot copy-paste. Product design sprints first, weekly demos throughout, an MVP in weeks rather than quarters.',
    tags: ['MVP in Weeks', 'Product Design', 'Scalable Backends', 'Usage Billing', 'AI-Native UX'],
  },
  {
    num: '06',
    cat: 'Decentralised Intelligence',
    lead: 'AI',
    accent: '×',
    tail: 'Blockchain',
    title: 'AI × Blockchain',
    interest: 'AI × Blockchain',
    short:
      'Where autonomous intelligence meets trustless rails. On-chain agents, AI-driven protocols, intelligent contract auditing and tokenised products — engineered for chains that never sleep.',
    long:
      'Where autonomous intelligence meets trustless rails. On-chain agents, AI-driven DeFi protocols, intelligent smart-contract auditing and tokenised products — engineered for chains that never sleep. We combine agentic AI with battle-tested web3 engineering so your protocol thinks as fast as it settles.',
    tags: ['On-Chain Agents', 'Smart Contract AI', 'DeFi Automation', 'Token Analytics', 'Web3 Products'],
  },
]

/* ———— how we work ———— */

export const PROCESS = [
  {
    n: '01',
    t: 'The Spark',
    d: 'A short discovery call. We ask the questions a top engineer would, and tell you honestly if AI is the wrong tool for your problem.',
  },
  {
    n: '02',
    t: 'The Blueprint',
    d: 'A fixed-scope proposal in days — defined outcomes, honest timelines, transparent pricing. You know the cost before we start.',
  },
  {
    n: '03',
    t: 'The Forging',
    d: 'Weekly demos of the real system. Your first working prototype lands before most agencies finish onboarding paperwork.',
  },
  {
    n: '04',
    t: 'The Quenching',
    d: 'Production hardening, evaluation harnesses, monitoring and handover. What leaves the forge keeps working after we leave.',
  },
]

export const VALUES = [
  {
    t: 'Ship, then polish',
    d: 'A working prototype in your hands beats a perfect plan in a deck. We put real software in front of you every single week.',
  },
  {
    t: 'Numbers or it didn’t happen',
    d: 'Every engagement is measured against the metric that matters to you — leads qualified, calls resolved, weeks to launch. We publish the results.',
  },
  {
    t: 'Your data stays yours',
    d: 'Model-agnostic builds, deployable on your infrastructure, with your IP delivered under your ownership at handover. No lock-in by design.',
  },
  {
    t: 'Humans in the loop',
    d: 'The best agents know their limits. Everything we forge escalates gracefully to your team — with full context, never a cold transcript.',
  },
]

export const FAQS = [
  {
    q: 'How fast can you ship an AI agent?',
    a: 'Most WhatsApp and voice agent deployments go live in two to four weeks. A full AI-powered SaaS platform typically ships its first working MVP in about six weeks, with weekly demos from week one.',
  },
  {
    q: 'Which AI models and platforms do you work with?',
    a: 'We are model-agnostic. We build on Claude, GPT-class models and open-weight models, choosing per use case for quality, latency and cost. Your data stays yours, and we can deploy on your cloud or ours.',
  },
  {
    q: 'Can your agents integrate with our existing CRM, calendar or phone system?',
    a: 'Yes. Integration is the core of every build: CRMs, calendars, EHRs, help desks, payment systems and existing telephony. Agents read from and write to the tools your team already uses.',
  },
  {
    q: 'Do your agents support languages other than English?',
    a: 'Yes. WhatsApp, voice and avatar agents can operate fluently in dozens of languages and switch language mid-conversation based on how the customer writes or speaks.',
  },
  {
    q: 'How is a project priced?',
    a: 'After a short discovery call we send a fixed-scope proposal with defined outcomes, honest timelines and no mystery invoices. You know the cost before we strike the first blow.',
  },
  {
    q: 'Who owns the intellectual property?',
    a: 'You do. Everything we forge for you — code, prompts, workflows, designs — is delivered under your ownership at handover.',
  },
  {
    q: 'Where does ForgeQubit work?',
    a: 'We are UK-registered and work remotely with clients across the United Kingdom, Europe and the United States, overlapping with both European and US business hours.',
  },
]

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
