# Contractor Assistant

A mobile-first, offline-first job tracker for contractors — no login, no cloud, no account creation. Everything is stored locally on the device via IndexedDB.

## Features

- **New Job wizard** — customer name (with autocomplete from past customers), phone/email/address with clipboard detection, job type, contact source, photos, and voice/text notes.
- **Job Dashboard** — stage tracker (New → Measuring → Estimating → Waiting Approval → Scheduled → In Progress → Complete → Paid), tap any stage to advance the job.
- **I'm Here / I'm Gone** — one-tap time tracking per visit. Automatically totals hours, computes labor cost from your hourly rate, and supports multiple workers.
- **Automatic timeline** — a chronological log built from what you're already doing (arrivals, departures, stage changes, photos added, notes updated, etc.) with no manual entry required.
- **Photos, measurements, estimate, invoice, materials, payments, documents** — quick per-job screens accessible from the dashboard.
- **Existing Jobs** — grouped by stage with counts, so you see what needs attention without scrolling through everything.

## Development

```bash
npm install
npm run dev
```

Open the printed local URL on your phone or in a mobile-width browser window. The app is installable as a PWA (add to home screen).

```bash
npm run build   # production build
npm run lint    # oxlint
```
