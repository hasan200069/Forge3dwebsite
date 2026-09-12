# International search strategy

Updated 12 September 2026. Targets: United States, United Kingdom, Europe and Middle East. Current website language: English. Canonical domain: https://www.forgequbit.co.uk.

## Implemented

- Prerendered `/international` page: market-specific project considerations, remote delivery, language scoping, data/hosting questions and links to the relevant services. No invented offices or client results.
- Homepage title and description describe an AI automation agency with international service availability. Service titles no longer unnecessarily restrict the offering to the UK.
- Visible market coverage and links from the homepage, services page and shared footer.
- Shared `AREA_SERVED` data in `src/markets.js` applied to organization, services and contact structured data. UK and USA are countries; Europe and Middle East are places, not fictitious country codes.
- Canonical URLs, sitemap inclusion, crawlable links, a distinct social image and accurate Open Graph/Twitter descriptions for the new page.
- The sitemap only emits modification dates where an explicit content date exists. It no longer labels unchanged static pages as modified on every build.
- Removed unused font preloads from the system-font design, reducing competition for initial page bandwidth.
- Existing genuine article content and service pages retained. No region-name-swapped duplicate pages.
- Build tests verify regional schema coverage, international links, sitemap inclusion and the absence of invented language alternates.

`llms.txt` and `llms-full.txt` also reflect service availability. These summaries are not a Google ranking factor or an indexing guarantee.

## Domain and language decisions

The `.co.uk` domain is a UK geographic signal. The international page makes the offering clear to overseas buyers, but cannot make the domain geographically neutral. If a verified, owned `.com` domain is chosen for a future global migration, plan URL-for-URL permanent redirects, canonical changes, sitemap changes and Search Console migration checks together. Do not run identical canonical sites on two domains.

The site keeps English and x-default self-references. There is no Arabic, German or French version yet, so no alternate-language tags imply one exists. Do not use `en-EU`, `en-ME` or `en-UK`: Europe and the Middle East are not valid hreflang country regions, and the UK code is GB. When real translations exist, give each a stable URL, reciprocal alternates, reviewed content and a visible language switcher.

## Deployment and measurement

1. Deploy this build to the existing canonical domain. These local changes do not affect live search results until published.
2. Verify the domain in Google Search Console and Bing Webmaster Tools using owner access. Submit `/sitemap.xml`; inspect `/international` plus the core service URLs. No verification tokens or account access were provided in this task.
3. In Search Console, monitor impressions, clicks, CTR and average position by country and landing page. Compare 28-day periods after indexing, allowing for seasonality and low volumes.
4. Track relevant queries: AI automation agency, AI receptionist, voice AI agents, WhatsApp automation, workflow automation services and custom AI development. Separate country filters for the UK, USA, UAE, Saudi Arabia and European countries relevant to actual enquiries. These are positioning themes, not claims based on keyword-volume research.
5. Publish permission-backed client work with real outcomes and measured baselines. Add verified company and professional profiles when available. Earn relevant regional links through genuine partnerships and publications.
6. Expand localized content in response to real enquiry/search data. Have Arabic or European-language content reviewed by fluent speakers and operational owners before making service-language claims.

Search rankings, rich results and indexing are determined by search engines and are not guaranteed by metadata or schema.

## Guidance consulted

- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://developers.google.com/search/docs/essentials/spam-policies
