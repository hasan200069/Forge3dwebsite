import { EMAIL, Footer, useReveal } from '../chrome.jsx'

const INTERESTS = [
  'WhatsApp Automation',
  'Voice Agents',
  'Avatar Agents',
  'Custom Agents',
  'AI-Powered SaaS',
  'AI × Blockchain',
  'Something Else',
]

const STEPS = [
  { n: '01', t: 'The Spark', d: 'Tell us the raw idea. We reply within 24 hours with the questions that matter.' },
  { n: '02', t: 'The Blueprint', d: 'A scoped proposal in days, not weeks — fixed outcomes, honest timelines, no mystery invoices.' },
  { n: '03', t: 'The Forging', d: 'Weekly demos of the real thing. Your first working prototype lands before onboarding paperwork would.' },
]

function ContactForm() {
  const onSubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const subject = encodeURIComponent(`Project inquiry — ${f.get('name')}`)
    const body = encodeURIComponent(
      `Name: ${f.get('name')}\nEmail: ${f.get('email')}\nInterested in: ${f.get('interest')}\n\n${f.get('message')}`
    )
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }
  return (
    <form className="contact-form rise d2" onSubmit={onSubmit}>
      <div className="form-row">
        <label className="field">
          <span>Your name</span>
          <input name="name" type="text" placeholder="Jane Smith" required className="hoverable" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" placeholder="jane@company.com" required className="hoverable" />
        </label>
      </div>
      <label className="field">
        <span>What shall we forge?</span>
        <select name="interest" defaultValue={INTERESTS[0]} className="hoverable">
          {INTERESTS.map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
      <label className="field">
        <span>The raw idea</span>
        <textarea name="message" rows="5" placeholder="Tell us what keeps you up at night…" required className="hoverable" />
      </label>
      <button type="submit" className="form-submit hoverable">
        Ignite the Project <span>→</span>
      </button>
      <p className="form-note">Opens your mail client — or write to us directly at {EMAIL}</p>
    </form>
  )
}

export default function Contact() {
  const ref = useReveal()
  return (
    <div className="page" ref={ref}>
      <div className="page-inner">
        <div className="contact-grid">
          <div className="contact-left">
            <div className="page-kicker rise">Final Chamber</div>
            <h1 className="page-title rise d1">The forge <span className="molten-text">is lit.</span></h1>
            <p className="page-sub rise d2">Bring us the raw idea. Leave with the weapon.</p>
            <a className="contact-email hoverable rise d2" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <div className="steps rise d3">
              {STEPS.map((s) => (
                <div key={s.n} className="step">
                  <span className="step-num">{s.n}</span>
                  <div>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
