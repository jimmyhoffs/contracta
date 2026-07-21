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

## Desktop app

The same app also runs as a native desktop app via [Tauri](https://tauri.app) — a real installable window (`.deb`/`.AppImage`/`.rpm` on Linux, `.dmg` on macOS, `.msi`/`.exe` on Windows), not just a browser tab. It shares the same code and local IndexedDB data as the web app; the window defaults to the app's mobile-shaped layout (480×880, resizable).

First-time setup (Linux):

```bash
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev pkg-config
```

Then:

```bash
npm run desktop:dev     # launch in a dev window with hot reload
npm run desktop:build   # produce installers in src-tauri/target/release/bundle/
```

macOS/Windows need their platform's usual native toolchain (Xcode Command Line Tools / MSVC Build Tools) instead of the apt packages above — see the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/).

### Windows build

Building on an actual Windows machine (or a Windows CI runner) is the normal path — install the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/#windows) there and run `npm run desktop:build`.

This repo is also set up to **cross-compile from Linux** for the cases where that's all you have:

```bash
rustup target add x86_64-pc-windows-gnu
sudo apt install -y mingw-w64 nsis
npm run desktop:build:windows
```

`src-tauri/.cargo/config.toml` points cargo at the mingw-w64 linker for the `x86_64-pc-windows-gnu` target. This produces a real `app.exe` (`src-tauri/target/x86_64-pc-windows-gnu/release/app.exe`); wrapping it into a signed NSIS installer additionally needs a helper DLL that Tauri fetches from `tauri-apps/nsis-tauri-utils` on GitHub at build time — if that host isn't reachable from your build environment, you'll get a working `.exe` but the bundling step will fail, and you can distribute the raw `.exe` directly or run the same command somewhere with normal GitHub access to get the packaged installer.
