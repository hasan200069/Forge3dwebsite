# Search and AI discoverability

What the site does for search engines and for the crawlers that feed
AI assistants, what is verified by tests, and what only the business can
do. Nothing here guarantees a position: Google, Bing and AI assistants
rank on relevance, authority and behaviour that no page can control.
The aim is to be the easiest source to crawl, understand, cite and
share.

## Built into the site (tested on every build)

| Layer | What is there | Test |
| --- | --- | --- |
| Real HTML | Every route is prerendered to a complete HTML file; a crawler that runs no JavaScript sees all headings, copy, links and structured data | routes, links, one `h1` per page |
| Titles and descriptions | Unique per page, titles ≤ 70 characters with the search terms buyers use (AI receptionist, WhatsApp and voice agents, workflow automation, custom AI products, UK), descriptions ≤ 165 | length and uniqueness |
| Canonical host | `https://www.forgequbit.co.uk` everywhere (the apex redirects to www), canonical and `hreflang` on every page | canonical per route |
| Indexing rules | `index, follow, max-image-preview:large`; 404 is `noindex`; unknown URLs return a real 404 status | robots meta and status |
| Redirects | Permanent (308) redirects for retired service slugs; no blanket redirect to the home page | each redirect and its target |
| Sitemap, RSS, robots | `sitemap.xml` with every indexable page, `rss.xml` for the blog, `robots.txt` allowing everyone and naming the AI crawlers explicitly (GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot, Applebot, CCBot and others) | sitemap contents, robots rules |
| Structured data | Organization/ProfessionalService, WebSite, WebPage, BreadcrumbList, Service, FAQPage (home, solutions, each service page), Blog and BlogPosting; all of it describes visible content only, with no reviews, ratings, locations or people that are not on the page | valid JSON-LD on every page |
| Social cards | A distinct card per page (`og-*.png`) with title, description and alt text for Open Graph and Twitter | card exists and is unique |
| Language-model summaries | `llms.txt` (a short, linked summary) and `llms-full.txt` (the substantive text of every page, with the illustrative labels kept) | present, linked, substantial |
| Internal linking | Crawlable nav and footer, breadcrumbs, related solutions from each blog post, choosers on the overview pages | every internal link resolves |
| Speed and stability | Inline CSS, code-split routes, self-hosted fonts, CLS 0, Lighthouse SEO 100 on audited pages | Lighthouse (lab) |

## What only the business can do

These move rankings and citations far more than any further on-page
change:

1. **Google Search Console and Bing Webmaster Tools.** Verify the
   `www` property, submit `https://www.forgequbit.co.uk/sitemap.xml`,
   and request indexing of `/services/voice-agents`. Add the
   verification token to `index.html` (`<meta name="google-site-verification">`)
   or use the DNS method.
2. **Google Business Profile.** A verified profile with the registered
   address is the strongest signal for "AI agency UK" style searches.
3. **Company facts on the site.** Companies House number, registered
   office and founder names, in `TEAM` and `COMPANY` in `src/data.js`.
   Named people and a verifiable company record are what assistants and
   search engines use to decide a business is real.
4. **Profiles and `sameAs`.** LinkedIn company page, GitHub, X and
   Crunchbase profiles that link to the site, then add their URLs to the
   Organization `sameAs` in `src/pages/Home.jsx`. Only real profiles.
5. **Evidence.** One permission-backed case study with a baseline and a
   metric definition is worth more than any keyword. The site is built
   to publish it without placeholders.
6. **Writing that answers real questions.** Two or three posts a quarter
   on the questions prospects ask on calls (cost of a voice agent,
   WhatsApp Business approval, human handoff design). Each post links
   to its solution page. No mass-generated articles.
7. **Links from others.** Directories for UK AI and automation
   agencies, partner listings (Twilio, HubSpot, Meta Business partners
   if applicable), guest writing, talks. Earned links are the ranking
   input the site itself cannot supply.

## Honest limits

- There is no registry through which MCP servers or AI models "find
  a website first". Assistants cite pages that are crawlable, clear and
  corroborated elsewhere. The site now covers the crawlable and clear
  parts; corroboration comes from items 2 to 7 above.
- Rankings and traffic are not predicted here. Measure them in Search
  Console after deployment, and read enquiries by source in Vercel
  Analytics (see `ANALYTICS.md`).
