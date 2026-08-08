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

Build on an actual Windows machine (or a Windows CI runner) — install the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/#windows) there and run `npm run desktop:build`.

Cross-compiling for Windows from Linux via the mingw-w64 GNU target (`x86_64-pc-windows-gnu`) isn't supported here: `app_lib` needs to be built as a `cdylib` for the Android app below, and GNU `ld` overflows the PE export-table ordinal limit when linking a `cdylib` for that target (tens of thousands of transitively-exported symbols vs. a 65535 ordinal ceiling). The MSVC target doesn't have this problem — if you need to cross-compile from Linux, look at [`cargo-xwin`](https://github.com/rust-cross/cargo-xwin) for `x86_64-pc-windows-msvc` instead.

## Android app

The app also builds as a native Android APK via Tauri's Android support.

First-time setup (Linux):

```bash
# Android SDK command-line tools
curl -sL -o /tmp/cmdline-tools.zip \
  https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
mkdir -p ~/Android/Sdk/cmdline-tools
unzip -q /tmp/cmdline-tools.zip -d ~/Android/Sdk/cmdline-tools
mv ~/Android/Sdk/cmdline-tools/cmdline-tools ~/Android/Sdk/cmdline-tools/latest
export PATH="$HOME/Android/Sdk/cmdline-tools/latest/bin:$PATH"

yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;27.0.12077973"

rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

Set these before running any `android:*` script (add to your shell profile):

```bash
export ANDROID_HOME=~/Android/Sdk
export NDK_HOME=$ANDROID_HOME/ndk/27.0.12077973
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64   # any JDK 17+ works
```

Then:

```bash
npm run android:init    # only if src-tauri/gen/android is missing — it's checked into git
npm run android:dev     # launch on a connected device/emulator with hot reload
npm run android:build   # debug APK in src-tauri/gen/android/app/build/outputs/apk/
```

`npm run android:build` builds all 4 ABIs into one ~450MB universal APK. For faster iteration on a real device, build just that device's arch, e.g. `npm run android:build -- --target aarch64` (~125MB, most phones/tablets since ~2018 are `aarch64`).

It's a **debug** APK, unsigned and not optimized — fine for sideloading onto a test device.

### Release build

`npm run android:release` produces a signed, minified APK (for sideloading) and AAB (for Play Store submission) in `src-tauri/gen/android/app/build/outputs/`.

This needs a signing keystore, which is **not** checked into git (losing it means future updates can't be signed with the same identity, and a Play Store listing tied to it can never be updated again — back it up somewhere durable, like a password manager).

First-time setup:

```bash
keytool -genkeypair -v -keystore ~/.android-keystores/contractoor-upload.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

Then create `src-tauri/gen/android/keystore.properties` (gitignored):

```properties
password=<your-password>
keyAlias=upload
storeFile=/absolute/path/to/contractoor-upload.jks
```

`src-tauri/gen/android/app/build.gradle.kts` already reads this file and wires it into the `release` build type's signing config.

## License

[MIT](LICENSE)
