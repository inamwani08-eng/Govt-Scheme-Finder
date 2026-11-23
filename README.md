# Yojana Saathi: Govt Scheme Finder

An interactive website that helps people anywhere in India find and shortlist the central and state government schemes they qualify for.

## What it does

- **Profile-based matching.** Enter state, age, gender, annual family income, category (General / EWS / OBC / SC / ST), rural or urban, occupation, current class or course, and situations such as BPL card, disability, widowhood, pregnancy, a daughter under 10, minority community or income-tax payer.
- **Recommended for you.** Schemes you clearly qualify for are ranked first, followed by ones you *might* qualify for, with a note on which detail is missing.
- **Browse by group.** Tiles for professions (students, farmers and fishers, job seekers, workers and artisans, business), caste categories and communities (SC, ST, OBC, minorities, General/EWS) and life situations (women, seniors, disability, BPL). Each shows how many schemes the user qualifies for.
- **Search and filters.** Free-text search, sector chips (agriculture, education, health, women & child, pensions, jobs, business loans, housing and more) and a Central / My state switch.
- **Scheme pages.** Key benefit, a line-by-line eligibility checklist against your profile (✓ / ✕ / ?), other conditions, documents needed, how to apply, and the official website.
- **Shortlist.** Save schemes, see one combined list of documents to keep ready, and copy the list to share on WhatsApp or email.
- **Hindi and English.** One tap switches every screen, scheme names, key benefits (`data/schemes-hi.js`) and eligibility text. Longer descriptions are in English for now.
- **Mobile-first, light and dark mode.** No sign-up; the profile and shortlist stay on your device (localStorage).

## Data

`data/schemes.js` holds a curated set of 115 schemes: 83 central schemes and 32 flagship state schemes from 17 states. Each entry links to its official portal; [myScheme](https://www.myscheme.gov.in) is the national reference.

Amounts and rules change often. The data was last reviewed in November 2026, and the site tells users to confirm on the official portal before applying.

### Adding a scheme

Add an object to `window.SCHEMES` in `data/schemes.js`. The comment at the top of that file documents every field. Eligibility rules go in `e`, for example:

```js
e: { st: ["MH"], g: "F", a: [21, 65], inc: 250000, notax: 1 }
```

Any rule not listed is treated as "open to all". Conditions the site can't check (land size, job type, etc.) go in `x` as text.

## Run it

It is a static site with no build step and no dependencies.

- Open `index.html` directly in a browser, or
- serve the folder: `python3 -m http.server 8000` and visit http://localhost:8000, or
- deploy to GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.

## Structure

```
index.html          page shell
assets/styles.css   design tokens, layout, light/dark themes
assets/app.js       eligibility engine, rendering, routing, i18n
data/schemes.js     scheme dataset
data/schemes-hi.js  Hindi key benefits, keyed by scheme id
```

## Disclaimer

Yojana Saathi is an independent guide and not an official government website.
