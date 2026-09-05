/* Pure logic for the contact form, kept free of JSX so the build test
   can import it directly. */
import { INTERESTS, LEGACY_INTERESTS } from './data.js'

/* Web3Forms public access key. Safe to ship in the client: it only
   identifies which inbox receives the message, and the service
   rate-limits and spam-filters on its side. */
export const ACCESS_KEY = 'b32d30de-6cc7-406d-b5fe-7f84bd709bd3'
export const ENDPOINT = 'https://api.web3forms.com/submit'

export function resolveInterest(raw) {
  if (!raw) return INTERESTS[0]
  if (INTERESTS.includes(raw)) return raw
  return LEGACY_INTERESTS[raw] ?? INTERESTS[0]
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Input limits, enforced in the browser (maxLength) and re-checked here
   before sending. Web3Forms validates the required fields and the email
   format again on its side; there is no first-party server to add to. */
export const LIMITS = { name: 120, email: 254, message: 4000 }

export function validate(values) {
  const errors = {}
  if (!values.name?.trim()) errors.name = 'Please enter your name.'
  else if (values.name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`
  if (!values.email?.trim()) errors.email = 'Please enter your work email.'
  else if (!EMAIL_RE.test(values.email.trim()) || values.email.length > LIMITS.email) errors.email = 'That email address does not look right.'
  if (!values.message?.trim() || values.message.trim().length < 20)
    errors.message = 'A sentence or two is enough, but please give us at least 20 characters.'
  else if (values.message.length > LIMITS.message)
    errors.message = `Please keep the description under ${LIMITS.message} characters.`
  return errors
}

/* Interprets a Web3Forms response. Success only when the service says so. */
export function interpretResponse(ok, data) {
  if (ok && data?.success) return null
  return data?.message
    ? `The form service replied: ${data.message}.`
    : 'The form service did not accept the message.'
}
