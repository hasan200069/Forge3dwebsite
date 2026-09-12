// Service availability, not office locations or claims of local incorporation.
export const AREA_SERVED = [
  { '@type': 'Country', name: 'United Kingdom' },
  { '@type': 'Country', name: 'United States' },
  { '@type': 'Place', name: 'Europe' },
  { '@type': 'Place', name: 'Middle East' },
]
export const MARKET_LABEL = 'UK, USA, Europe and the Middle East'
export const INTERNATIONAL_FAQS = [
  { q: 'Can we work with you outside the UK?', a: 'Yes. ForgeQubit offers remote AI development and automation services to businesses in the United States, the United Kingdom, Europe and the Middle East. Tell us your country, time zone and preferred meeting times when you enquire.' },
  { q: 'Can an agent support our customers’ language and local hours?', a: 'Tell us the languages, channels and operating hours you need. Language coverage, voice quality, phone-number availability and escalation hours are assessed during discovery and included in the agreed scope. This website and initial project communication are in English.' },
  { q: 'How are hosting and customer-data requirements handled?', a: 'We establish your hosting requirements, data access, retention needs and approval process before selecting tools. Hosting regions and third-party services depend on the project. Any legal or regulatory requirements should be reviewed with your own adviser before launch.' },
  { q: 'How do proposals and international handovers work?', a: 'Your proposal sets out deliverables, timeline, payment currency, third-party costs and support terms. Weekly working demos provide checkpoints. At handover, code, documentation and the agreed accounts are transferred or made available to your team.' },
]
export const MARKETS = [
  { id: 'usa', name: 'United States', intro: 'AI automation for US businesses', body: 'Connect lead capture, appointment scheduling and customer follow-up across your existing systems. For multi-state teams, we scope time zones, routing and the handoff to local staff before building.', to: '/services/voice-agents', link: 'Explore AI voice agents' },
  { id: 'uk', name: 'United Kingdom', intro: 'A UK-registered AI development partner', body: 'Build a reception agent for phone and WhatsApp enquiries, or connect the everyday tools behind your operations. Agree the booking rules, customer journey and exceptions with the people who use them.', to: '/services/ai-reception', link: 'Explore AI reception' },
  { id: 'europe', name: 'Europe', intro: 'Connected workflows for European teams', body: 'Bring fragmented systems into one practical workflow. Discovery covers the languages your users need, hosting preferences, access permissions and which actions require a person’s approval.', to: '/services/workflow-automation', link: 'Explore workflow automation' },
  { id: 'middle-east', name: 'Middle East', intro: 'AI agents and products for regional operations', body: 'For teams in markets such as the UAE and Saudi Arabia, start with the channels your customers use. Scope WhatsApp enquiries, English and Arabic requirements, local operating hours and regional integrations before implementation.', to: '/services/custom-ai-products', link: 'Explore custom AI products' },
]
