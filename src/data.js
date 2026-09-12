/* ————————————————————————————————————————
   Site content. Single source of truth — pages, the prerenderer, the
   sitemap and the contact form's option list all read from here, so
   copy can never drift between a page and the metadata describing it.

   Evidence policy: nothing in this file is presented as client work.
   Every scenario, transcript and number is labelled illustrative in
   the UI. See HANDOVER.md for what is needed to publish real proof.
   ———————————————————————————————————————— */

/* ———— primary solutions ———— */

export const SOLUTIONS = [
  {
    slug: 'ai-reception',
    path: '/services/ai-reception',
    num: '01',
    name: 'AI Reception & Lead Handling',
    shortName: 'AI Reception',
    interest: 'AI Reception & Lead Handling',
    tagline: 'Answer every enquiry, qualify it, book it, hand it off.',
    short:
      'Voice and WhatsApp agents that pick up enquiries in seconds, ask the qualifying questions your team would, book appointments into the calendar and hand off to a person when it matters.',
    problem:
      'Enquiries arrive by phone and WhatsApp all day, and most teams can only answer between other jobs. Slow replies lose prospects; missed calls lose bookings.',
    build:
      'A voice agent on your phone number and a WhatsApp agent on your business number, sharing one set of rules, one calendar and one CRM. Both know when to stop and pass to a human.',
    outcome:
      'Faster first responses, fewer missed enquiries, cleaner CRM records, and staff time back for the conversations that need a person.',
    who: [
      'Service businesses that take bookings or quotes by phone and WhatsApp: clinics, estate agents, trades, salons, legal and financial practices.',
      'Operations teams with a shared inbox or reception line that is busiest exactly when staff are with customers.',
      'Sales teams running ad campaigns that generate more conversations than they can answer within minutes.',
    ],
    problems: [
      'Enquiries answered hours later, or not at all, because everyone was busy.',
      'Calls going to voicemail at peak times, with no callback record.',
      'Qualifying questions asked inconsistently, so the CRM has half the information.',
      'Appointment bookings that need three messages back and forth to confirm.',
      'No clear rule for when an automated reply should stop and a person should step in.',
    ],
    includes: [
      'Discovery of your enquiry types, qualifying criteria and booking rules.',
      'Conversation design for voice and WhatsApp, including tone, languages and fallbacks.',
      'Integration with your calendar, CRM and telephony or WhatsApp Business account.',
      'Human handoff paths: live transfer, callback request, or a summarised ticket for your team.',
      'Test conversations against real scenarios before launch, then a monitored launch period.',
      'Handover: documentation, admin access to every account, and a change process.',
    ],
    example: {
      title: 'Illustrative scenario: property viewing enquiry on WhatsApp',
      steps: [
        { who: 'Customer', text: 'Hi, is the 2-bed flat on Mill Lane still available? Could I see it this week?' },
        { who: 'Agent', text: 'It is. Viewings are Tuesday 5pm, Wednesday 12pm or Saturday 10am. Before I book, are you renting or buying, and when would you want to move?' },
        { who: 'Customer', text: 'Renting, ideally by the end of next month.' },
        { who: 'Agent', text: 'Thanks. Wednesday 12pm is free. Shall I book it under this number and send the address and what to bring?' },
        { who: 'Customer', text: 'Yes please.' },
        { who: 'System', text: 'Viewing created in calendar. Contact updated in CRM with intent: rent, timeline: 4–6 weeks. Negotiator notified.' },
      ],
      note: 'Sample conversation written to show the intended flow. Not a transcript from a live deployment.',
    },
    integrations: [
      'WhatsApp Business Platform (Meta Cloud API)',
      'Twilio, Vonage and SIP telephony',
      'Google Calendar, Microsoft 365 and Calendly',
      'HubSpot, Pipedrive, Zoho and custom CRMs',
      'Practice and booking systems via API',
      'Slack, Microsoft Teams and email for handoffs',
    ],
    delivery: {
      expectation:
        'A first working agent on a test number is usually demonstrable within the first fortnight of a build. Go-live depends mostly on integration access and how many enquiry types you want covered at launch.',
      drivers: [
        'Number of enquiry types and booking rules to cover.',
        'Whether the CRM and calendar have usable APIs, or need workarounds.',
        'Voice, WhatsApp, or both, and how many languages.',
        'Compliance needs, such as recording consent or identity checks.',
      ],
      running:
        'Ongoing costs are mostly third-party usage: telephony minutes, WhatsApp conversation fees charged by Meta, and language-model usage. We set these accounts up in your name and estimate monthly usage in the proposal.',
    },
    support:
      'After launch we monitor conversations for an agreed period, tune the rules with you, and document everything. Ongoing support is optional and priced separately.',
    faqs: [
      {
        q: 'What happens when the agent cannot help?',
        a: 'It says so and hands off. Depending on the channel that means transferring the call, taking a callback request, or sending your team a summary with the full conversation so nobody repeats themselves.',
      },
      {
        q: 'Will callers know they are speaking to an AI?',
        a: 'Yes. The agent introduces itself as an automated assistant. Being upfront keeps trust and, in some jurisdictions, is a legal requirement.',
      },
      {
        q: 'Do we need an official WhatsApp Business account?',
        a: 'Yes. We build on the WhatsApp Business Platform, which requires a verified business and a dedicated number. We guide you through the application; the account is yours.',
      },
      {
        q: 'Can it use our existing phone number?',
        a: 'Usually. Existing numbers can be forwarded or ported to a telephony provider that supports voice agents. We confirm the options during discovery.',
      },
    ],
  },
  {
    slug: 'workflow-automation',
    path: '/services/workflow-automation',
    num: '02',
    name: 'Workflow Automation & Integrations',
    shortName: 'Workflow Automation',
    interest: 'Workflow Automation & Integrations',
    tagline: 'Connect the tools you already use and remove the repetitive steps.',
    short:
      'Connected workflows across CRMs, calendars, support desks, documents and internal tools, with clear rules for approvals and exceptions.',
    problem:
      'Work moves between tools by copy and paste. Data is re-typed, follow-ups are forgotten, and the person who knows the process is the bottleneck.',
    build:
      'Event-driven workflows and integrations, with language models used only where judgement is needed: reading documents, classifying requests, drafting replies for approval.',
    outcome:
      'Fewer manual steps, faster turnaround, an audit trail for every action, and people spending their time on decisions instead of data entry.',
    who: [
      'Operations and finance teams handling orders, invoices, onboarding or support tickets across several systems.',
      'Agencies and professional services firms with repeatable client processes.',
      'Businesses that have outgrown spreadsheets and email as their workflow engine.',
    ],
    problems: [
      'The same information entered into a CRM, an accounting tool and a spreadsheet by hand.',
      'Documents that arrive by email and need reading, categorising and forwarding.',
      'Follow-ups and reminders that depend on someone remembering.',
      'Reports assembled manually every week from several sources.',
      'Automations built in a rush that fail silently when a tool changes.',
    ],
    includes: [
      'Process mapping: what happens today, where it breaks, and what a person must still approve.',
      'Integration with your systems via APIs, webhooks and, where unavoidable, files and email.',
      'Language-model steps for extraction, classification and drafting, each with a confidence threshold.',
      'Approval and exception handling: anything uncertain is routed to a named person, never guessed.',
      'Logging, alerts and retries so failures are visible and recoverable.',
      'Handover with runbooks, credentials in your accounts, and a plan for changes.',
    ],
    example: {
      title: 'Illustrative scenario: supplier invoices from inbox to accounting',
      flow: [
        { label: 'Invoice email received', kind: 'trigger' },
        { label: 'Extract supplier, amount, PO number', kind: 'ai' },
        { label: 'Match to purchase order', kind: 'system' },
        { label: 'Confidence below threshold or amount mismatch?', kind: 'decision' },
        { label: 'Finance approves in Slack with one click', kind: 'human' },
        { label: 'Post to accounting system, notify requester', kind: 'system' },
      ],
      note: 'Illustrative workflow. Thresholds, tools and approval steps are agreed per project.',
    },
    integrations: [
      'HubSpot, Salesforce, Pipedrive and Zoho',
      'Xero, QuickBooks and Sage',
      'Zendesk, Freshdesk, Intercom and HelpScout',
      'Google Workspace and Microsoft 365',
      'Slack, Teams, Notion and Airtable',
      'Custom internal tools and databases via REST and webhooks',
    ],
    delivery: {
      expectation:
        'Most automation projects are delivered as a sequence of small releases, each removing one manual step, so value arrives early and every change can be checked by your team.',
      drivers: [
        'Number of systems involved and the quality of their APIs.',
        'How much judgement each step needs, and how strict the approval rules are.',
        'Volume and variety of documents or requests.',
        'Whether the process is already defined, or needs to be designed first.',
      ],
      running:
        'Ongoing costs are hosting for the workflow runtime, any subscription fees for tools you choose to use, and language-model usage where it is part of the flow. All accounts are in your name.',
    },
    support:
      'Every workflow ships with monitoring and alerts. We offer a support arrangement for changes and upstream API updates, or train your team to maintain it.',
    faqs: [
      {
        q: 'Do you use no-code tools or write custom code?',
        a: 'Both, depending on the job. Established platforms such as Make or n8n are fine for simple, low-volume flows. Anything with high volume, sensitive data or complex logic is written as code you own, with tests.',
      },
      {
        q: 'How do you stop an automation making a bad decision?',
        a: 'Every AI step has a confidence threshold and a defined fallback. Uncertain cases go to a person for approval. Actions that move money or contact customers always have a review step unless you decide otherwise.',
      },
      {
        q: 'What if one of our tools changes its API?',
        a: 'Failures are logged and alerted rather than hidden, and integrations are isolated so one change does not break the whole flow. Support arrangements cover this kind of maintenance.',
      },
    ],
  },
  {
    slug: 'custom-ai-products',
    path: '/services/custom-ai-products',
    num: '03',
    name: 'Custom AI Product Development',
    shortName: 'Custom AI Products',
    interest: 'Custom AI Product Development',
    tagline: 'Design and engineering for AI applications, agent systems and SaaS.',
    short:
      'Product design and full-stack engineering for AI applications, multi-step agent systems and software products that need dedicated design and evaluation.',
    problem:
      'You have a validated idea or an internal process worth turning into a product, but it needs real engineering: data, evaluation, interface, billing and operations.',
    build:
      'An application with language-model capability at its core, built with an evaluation harness from the start so quality can be measured, plus the ordinary parts a product needs: auth, billing, admin and monitoring.',
    outcome:
      'A product you can put in front of users, measure honestly, and keep improving. Code, prompts, data and infrastructure are yours.',
    who: [
      'Founders building an AI-first product who need a design and engineering team rather than a prototype.',
      'Established businesses productising an internal capability for customers or partners.',
      'Teams with an existing product that needs AI features built properly rather than bolted on.',
    ],
    problems: [
      'A demo that impressed everyone but cannot be measured or scaled.',
      'AI features that feel like a chat box glued onto the side of an app.',
      'No way to know whether a model change made the product better or worse.',
      'Unclear costs per user because model usage was never designed in.',
      'A prototype built by one person that nobody else can maintain.',
    ],
    includes: [
      'Product discovery and scoping: the one workflow users will pay for first.',
      'Interface and interaction design for AI features, including uncertainty and correction states.',
      'Application engineering: web app, API, data model, auth, billing and admin.',
      'Agent and retrieval design with an evaluation set built from real examples.',
      'Deployment, observability, cost tracking and a security review before launch.',
      'Handover of repositories, infrastructure and documentation to your team.',
    ],
    example: {
      title: 'Illustrative scenario: document review assistant for a professional services firm',
      steps: [
        { who: 'Scope', text: 'Reviewers upload client documents, get a structured summary with flagged clauses, and correct anything wrong. Corrections feed the evaluation set.' },
        { who: 'Build', text: 'Web app with role-based access, document pipeline, retrieval over the firm’s own precedents, review interface with side-by-side citations.' },
        { who: 'Measure', text: 'Precision and recall of flagged clauses against a reviewer-labelled set, time per review, and cost per document.' },
        { who: 'Ship', text: 'Pilot with a small group, weekly demos, then wider rollout once quality targets are met.' },
      ],
      note: 'Illustrative scope written to show how a product engagement is structured. Not a description of a delivered client project.',
    },
    integrations: [
      'Claude, GPT-class and open-weight models, chosen per task',
      'Postgres, vector search and document pipelines',
      'Stripe for billing and usage metering',
      'Auth providers such as Clerk, Auth0 and Supabase',
      'AWS, Google Cloud, Vercel and your own infrastructure',
      'Existing products via API',
    ],
    delivery: {
      expectation:
        'Product work runs in short cycles with a working demo each week. A first usable version for pilot users is the usual first milestone; the timeline to get there depends on the scope you choose to launch with.',
      drivers: [
        'Breadth of the first release, and how much can wait until after launch.',
        'Data availability and quality for retrieval and evaluation.',
        'Design complexity and number of user roles.',
        'Compliance, security and hosting requirements.',
      ],
      running:
        'Ongoing costs are cloud hosting, model usage, and third-party services such as payments and email. We design cost tracking into the product so you can see cost per user from day one.',
    },
    support:
      'After launch we can continue as your product engineering team, hand over to your own engineers with a structured transition, or support them on a retainer.',
    faqs: [
      {
        q: 'Which models do you build on?',
        a: 'We are model-agnostic. Models are chosen per task for quality, latency and cost, and the product is built so the model can be swapped when a better one arrives.',
      },
      {
        q: 'Can you work with our existing engineering team?',
        a: 'Yes. We can lead the AI parts while your team owns the rest, or embed alongside them. Repositories, standards and reviews are shared from the start.',
      },
      {
        q: 'Who owns the code, prompts and data?',
        a: 'You do. Deliverables are assigned to you on payment as set out in the engagement agreement, and everything runs in accounts in your name.',
      },
    ],
  },
]

/* ———— voice agents: a dedicated page for the URL search engines already know ———— */

export const VOICE = {
  slug: 'voice-agents',
  path: '/services/voice-agents',
  name: 'Voice Agents',
  interest: 'Voice Agent',
  short:
    'Phone agents that answer on the first ring, handle bookings and common questions, and transfer to your team with context when a call needs a person.',
  who: [
    'Businesses whose phone line is busiest when staff are with customers.',
    'Teams replacing a menu-based IVR that callers dislike.',
    'Companies handling out-of-hours calls with voicemail today.',
  ],
  handles: [
    'Answering common questions: opening hours, prices, directions, availability.',
    'Booking, rescheduling and cancelling appointments in your calendar or booking system.',
    'Taking structured messages and callback requests when nobody is free.',
    'Screening and routing calls to the right person or department.',
    'Outbound reminders and confirmations, where consent rules allow.',
  ],
  handsOff: [
    'Anything the caller asks to escalate.',
    'Complaints, emergencies and requests outside the agreed scope.',
    'Low-confidence understanding, such as a poor line or an unusual request.',
  ],
  integrations: [
    'Twilio, Vonage and SIP trunks',
    'Existing numbers by forwarding or porting',
    'Google Calendar, Microsoft 365 and booking systems',
    'CRMs and helpdesks for call summaries',
    'Slack, Teams and email for handoff alerts',
  ],
  faqs: [
    {
      q: 'How natural does it sound?',
      a: 'Current speech models respond in well under two seconds and handle interruptions, so conversations feel like talking to a person who is upfront about being an assistant. We test with real callers before launch and adjust voice and pacing.',
    },
    {
      q: 'What does it cost to run?',
      a: 'Per-minute telephony charges plus speech and language-model usage, billed by the providers to accounts in your name. We estimate monthly usage from your current call volume during scoping.',
    },
    {
      q: 'Can it handle more than one language?',
      a: 'Yes. Agents can operate in several languages and switch based on how the caller speaks. We agree the supported languages up front so they can be tested properly.',
    },
    {
      q: 'Are calls recorded?',
      a: 'Only if you decide they should be, with the announcement and consent handling your jurisdiction requires. Transcripts can be stored in your CRM or discarded after summarising.',
    },
  ],
}

/* ———— secondary capabilities ———— */

export const CAPABILITIES = [
  {
    id: 'avatars',
    name: 'Avatar Agents',
    interest: 'Avatar Agents',
    short:
      'Talking digital avatars for kiosks, onboarding and training content, built on the same conversation engine as our voice agents. Scoped as an addition to a reception or product project rather than a standalone offer.',
  },
  {
    id: 'blockchain',
    name: 'AI × Blockchain',
    interest: 'AI × Blockchain',
    short:
      'Agent systems that interact with on-chain protocols, plus analytics and smart-contract tooling that uses language models for review and monitoring. Offered to teams who already operate in web3 and need engineering rather than advice.',
  },
]

/* ———— delivery process ———— */

export const PROCESS = [
  {
    n: '01',
    t: 'Discover',
    d: 'A short call, then a look at your current process, tools and volumes. We tell you plainly if AI is not the right fix.',
    you: 'Share the problem, the tools involved and who uses them.',
    we: 'Write up what we heard and propose an approach.',
    out: 'A one-page summary you can share internally.',
  },
  {
    n: '02',
    t: 'Scope',
    d: 'A written proposal with fixed scope, defined outcomes, price and an estimate of ongoing third-party costs.',
    you: 'Confirm the scope and provide access to the systems involved.',
    we: 'Set up accounts in your name and plan the build in weekly milestones.',
    out: 'Signed proposal, project plan, access checklist.',
  },
  {
    n: '03',
    t: 'Build',
    d: 'Weekly demos of the working system, tested against real scenarios you help us collect.',
    you: 'Review each demo and supply real examples for testing.',
    we: 'Build, integrate, test and adjust based on what you see.',
    out: 'A working system on test numbers or staging, with a test log.',
  },
  {
    n: '04',
    t: 'Launch & Support',
    d: 'A monitored launch, documentation and handover, then optional support for changes and maintenance.',
    you: 'Approve go-live and nominate who owns the system internally.',
    we: 'Monitor, tune, document, and hand over every credential.',
    out: 'Live system, runbook, admin access, support plan.',
  },
]

/* ———— engineering approach ———— */

export const ENGINEERING = [
  {
    t: 'Integrated, not bolted on',
    d: 'Agents read from and write to your CRM, calendar and helpdesk through their APIs, so records stay in the tools your team already uses.',
  },
  {
    t: 'Tested against real scenarios',
    d: 'Before launch, every build is run against a set of real enquiries and edge cases collected with you, and the results are shared.',
  },
  {
    t: 'Monitored after launch',
    d: 'Conversation logs, failure alerts and usage dashboards are part of every delivery, so problems are visible and costs are predictable.',
  },
  {
    t: 'Handed over properly',
    d: 'Accounts are in your name, code is in your repositories, and documentation explains how to change things without us.',
  },
]

/* ———— faqs (home + services overview) ———— */

export const FAQS = [
  {
    q: 'What drives the cost of a project?',
    a: 'Mostly scope: how many enquiry types or process steps you want covered at launch, how many systems need integrating, and how good their APIs are. Voice, WhatsApp and multiple languages each add work. We give a fixed price for a defined scope after discovery.',
  },
  {
    q: 'What are the ongoing costs after launch?',
    a: 'Third-party usage billed to accounts in your name: telephony minutes, WhatsApp conversation fees charged by Meta, language-model usage and hosting. We estimate these in the proposal from your current volumes. Support from us is optional and priced separately.',
  },
  {
    q: 'How long does a project take?',
    a: 'It depends on scope and on how quickly we get access to your systems. A first working demo usually lands within the first two weeks of a build. We give a timeline in the proposal and report progress against it every week.',
  },
  {
    q: 'Which tools can you integrate with?',
    a: 'Most CRMs, calendars, helpdesks, accounting and booking systems with an API, plus WhatsApp Business, telephony providers, Slack, Teams and email. If a tool has no API we will say so and propose a workaround before you commit.',
  },
  {
    q: 'What happens when the AI cannot handle something?',
    a: 'It hands off. Every agent has defined limits and a route to a person: a live transfer, a callback, or a summarised ticket. Automations route uncertain cases to a named approver rather than guessing.',
  },
  {
    q: 'Who owns what we build?',
    a: 'You do. Code, prompts, workflows and designs are assigned to you on payment under the engagement agreement. Third-party accounts such as WhatsApp Business, telephony and cloud are set up in your name from the start.',
  },
  {
    q: 'What support do you offer after launch?',
    a: 'Every project includes a monitored launch period and documentation. After that you can run it yourself, ask us for changes as needed, or agree a support retainer for monitoring and maintenance.',
  },
  {
    q: 'Where are you based and who do you work with?',
    a: 'ForgeQubit is registered in the United Kingdom and offers remote services to clients in the UK, USA, Europe and the Middle East.',
  },
]

/* ———— illustrative reference builds (the /case-studies page) ———— */

export const DEMOS = [
  {
    slug: 'enquiry-to-viewing',
    num: '01',
    solution: 'ai-reception',
    field: 'AI Reception & Lead Handling',
    title: 'Enquiry to booked viewing on WhatsApp',
    context:
      'A lettings team running paid campaigns that generate a high volume of WhatsApp enquiries, answered between viewings by negotiators.',
    scope: [
      'WhatsApp agent on the official Business Platform, fluent in the current listings.',
      'Qualifying questions: rent or buy, budget, timeline, requirements.',
      'Viewing booking into negotiator calendars with confirmation and reminders.',
      'CRM update with a structured record and intent score, negotiator alerted for hot leads.',
      'Handoff to a person on request, for complaints, or on low confidence.',
    ],
    measures: [
      'First response time, measured from customer message to first reply.',
      'Enquiries qualified, defined as a completed set of qualifying answers.',
      'Viewings booked per week, before and after, over a matched period.',
      'Handoff rate and reasons, reviewed weekly.',
    ],
    visual: 'chat',
  },
  {
    slug: 'clinic-phone-reception',
    num: '02',
    solution: 'ai-reception',
    field: 'Voice Agents',
    title: 'Phone reception for a multi-site clinic',
    context:
      'A group of clinics whose reception lines ring busy at peak times, with bookings, reschedules and opening-hours questions making up most calls.',
    scope: [
      'Voice agent answering the main number with an automated-assistant introduction.',
      'Booking and rescheduling in the practice management system, with patient verification.',
      'Answers to the most common questions, maintained by the practice manager.',
      'Transfer to reception with a spoken summary for anything outside scope.',
      'Out-of-hours handling with structured messages and next-day callbacks.',
    ],
    measures: [
      'Calls answered within three rings, as a share of all calls.',
      'Calls resolved without a transfer, with the definition agreed in advance.',
      'Missed and abandoned calls at peak hours, before and after.',
      'Caller feedback from a short optional survey.',
    ],
    visual: 'call',
  },
  {
    slug: 'invoice-exceptions',
    num: '03',
    solution: 'workflow-automation',
    field: 'Workflow Automation & Integrations',
    title: 'Supplier invoices with human approval',
    context:
      'A finance team receiving supplier invoices by email, matching them to purchase orders by hand and chasing approvals in chat.',
    scope: [
      'Inbox monitoring and document extraction with confidence scores.',
      'Automatic matching to purchase orders in the accounting system.',
      'Exceptions routed to an approver in Slack with a one-click decision.',
      'Posting to the accounting system and notification to the requester.',
      'Audit log of every action and decision.',
    ],
    measures: [
      'Share of invoices processed without manual touch.',
      'Time from receipt to posting.',
      'Extraction accuracy against a reviewed sample each month.',
      'Exceptions per week and their causes.',
    ],
    visual: 'flow',
  },
]

/* ———— blog posts ———— */

export const POSTS = [
  {
    slug: 'whatsapp-agent-next-hire',
    date: 'July 2026',
    iso: '2026-07-06',
    tag: 'AI Reception',
    readTime: '5 min read',
    title: 'Why Your Next Hire Should Live Inside WhatsApp',
    excerpt:
      'Two billion people already have the app open. The businesses winning right now are the ones answering in seconds, not hours.',
    body: [
      { h: null, p: 'Every business we meet has the same graveyard: a WhatsApp inbox full of enquiries that were answered too late or never at all. Each one was a person with intent, money in hand, question half-typed, who moved on to whoever replied first.' },
      { h: 'Speed is the whole game', p: 'Research on lead response has said the same thing for a decade: reply within five minutes and your odds of qualifying a lead are dramatically higher than replying within an hour. On WhatsApp, expectations are even tighter. It is a chat app, and chat means now. No hiring plan gets a human to every message in seconds, twenty-four hours a day. An agent does that by default.' },
      { h: 'Not a chatbot, a colleague', p: 'The word "chatbot" earned its bad reputation: decision trees, canned answers, the dreaded "I didn’t understand that." Modern conversational agents are a different species. They read intent, hold context across days of conversation, consult your actual pricing and inventory, and know when to hand off to a human with a full summary instead of a cold transcript.' },
      { h: 'The compounding part', p: 'The underrated benefit is memory. Every conversation an agent handles becomes structured data: what people ask for, where they hesitate, which objections keep appearing. That intelligence flows back into your marketing and product decisions. Your inbox stops being a cost centre and becomes an instrument.' },
      { h: 'Where to start', p: 'Pick the one flow that hurts most, usually lead qualification or order support, and automate it end to end before touching anything else. A narrow agent that fully owns one job beats a broad one that half-does five. That first win funds the rest of the roadmap.' },
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
      'Fast responses and natural interruption handling changed everything. Most callers can no longer tell, and mostly, they no longer care.',
    body: [
      { h: null, p: 'For years, calling a company and hearing a robot meant one thing: mash zero and pray for a human. The technology deserved the reflex: high latency, brittle scripts, a voice that could not be interrupted without collapsing.' },
      { h: 'What actually changed', p: 'Three things arrived together: speech models that respond in around a second, voices with genuine prosody rather than text-to-speech flatness, and, most importantly, interruption handling. A caller can talk over the agent mid-sentence and it stops, listens, and adjusts, exactly like a person would. That last detail is what dissolves the uncanny valley; conversation is interruption.' },
      { h: 'The economics', p: 'A voice agent answers every call on the first ring, at 3 a.m. on a public holiday, in a consistent voice, and never has a bad day. For a clinic or brokerage, the maths is not "cheaper receptionist". It is "fewer missed calls", and every missed call was revenue you had already paid marketing money to generate.' },
      { h: 'Where humans stay', p: 'The goal is not replacing your team; it is refusing to waste them. Most call volume is bookings, opening hours, and status checks. Route that to the agent, and the calls that reach a human are the ones that genuinely need judgement, empathy, or authority. Your callers get faster answers and your staff get better work.' },
      { h: 'The test that matters', p: 'Forget Turing. The commercial test is simpler: does the caller accomplish what they called for, quickly, without frustration? Well-built agents pass it daily, and they are honest about being automated while doing so. The businesses adopting them are not early any more. They are on time.' },
    ],
  },
  {
    slug: 'ai-saas-six-weeks',
    date: 'May 2026',
    iso: '2026-05-14',
    tag: 'Custom AI Products',
    readTime: '7 min read',
    title: 'Shipping an AI SaaS in Six Weeks Without Burning Down',
    excerpt:
      'Speed is not recklessness. It is sequencing. The process we use to take founders from an idea to a product real users can pay for.',
    body: [
      { h: null, p: 'Six weeks from idea to paying users sounds like a growth-hack headline. It is actually the opposite: a boring, disciplined sequence that removes every decision that does not need to be made yet. It is a target we plan towards, not a promise; the scope you choose to launch with decides whether you hit it.' },
      { h: 'Week one is the product', p: 'We spend the first week refusing to write code. Design sprints, ruthless scope-cutting, and one question asked repeatedly: what is the single workflow a user would pay for this month? Everything else, the settings page, the second user role, the dashboard nobody asked for, goes on a list titled "after revenue."' },
      { h: 'The AI core is not a feature', p: 'Most "AI features" are a text box bolted onto a normal app, and users can tell. We build the intelligence into the core workflow, the thing the product does when it is doing its job. That is also why we build evaluation harnesses before we build UI: an AI product that cannot measure its own accuracy is a demo, not a business.' },
      { h: 'Boring infrastructure, deliberately', p: 'Managed database, managed auth, usage-based billing from a provider that has solved it, one cloud region. Every exotic infrastructure choice is a tax on your six weeks. The architecture should be interesting in exactly one place: the engine your competitors cannot copy-paste.' },
      { h: 'Demos over documents', p: 'Every week, the founder sees the real product with real data, never a slide deck. Weekly demos surface wrong assumptions while they are still cheap to fix and keep momentum honest. By launch there is no drama, because the product has already been shown to its harshest audience several times.' },
      { h: 'What six weeks buys you', p: 'Not a finished company: a working product, real usage data, and the credibility that comes from shipping. Fundraising conversations change entirely when the demo is a login page. That is the actual point of speed: it converts belief into evidence before the market moves on.' },
    ],
  },
]

/* ———— people and company details ————
   Rendered only when filled in. Leave empty rather than adding
   placeholders: the About page explains accountability structurally
   until real, permission-backed details are supplied. Each person needs
   a name and role; photo (path under /public), bio and links are
   optional. Do not attribute work done at previous employers to
   ForgeQubit. */

export const TEAM = [
  // { name: '', role: '', bio: '', photo: '/team/name.jpg', links: [{ label: 'LinkedIn', href: '' }] },
]

export const COMPANY = {
  legalName: 'ForgeQubit',
  registeredIn: 'United Kingdom',
  companyNumber: null, // Companies House number, e.g. '12345678'
  registeredOffice: null, // full registered address, one string
  founded: null, // year, as a string
}

/* ———— contact form options ———— */

export const INTERESTS = [
  ...SOLUTIONS.map((s) => s.interest),
  VOICE.interest,
  ...CAPABILITIES.map((c) => c.interest),
  'Something else',
]

/* Old links used the previous service names in ?interest=. Map them so
   they still preselect something sensible. */
export const LEGACY_INTERESTS = {
  'WhatsApp Automation': SOLUTIONS[0].interest,
  'Voice Agents': VOICE.interest,
  'Avatar Agents': 'Avatar Agents',
  'Custom Agents': SOLUTIONS[2].interest,
  'Custom AI Agents': SOLUTIONS[2].interest,
  'AI-Powered SaaS': SOLUTIONS[2].interest,
  'AI × Blockchain': 'AI × Blockchain',
}

export const contactHref = (interest) =>
  interest ? `/contact?interest=${encodeURIComponent(interest)}` : '/contact'
