# GRE Sprint · 30-Day Prep App

A full Progressive Web App (PWA) for GRE prep — 285 vocabulary flashcards across 19 decks, 69 practice questions across 7 categories, a 30-day daily plan, essay walkthrough, and practice timer. Built so **she studies on her Android, you track her progress on your iPhone**.

---

## Deploy to GitHub Pages (10 minutes)

### Step 1 — Create the repo

1. Go to [github.com/new](https://github.com/new)
2. Name it **`gre-sprint`** (or anything you like)
3. Set to **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Step 2 — Upload the files

Option A — drag and drop in the browser:
1. Open your new repo on GitHub
2. Click **Add file → Upload files**
3. Drag the entire `gre-pwa/` folder contents (all files + icons folder) into the window
4. Click **Commit changes**

Option B — Git on your machine:
```bash
cd gre-pwa
git init
git remote add origin https://github.com/YOUR_USERNAME/gre-sprint.git
git add .
git commit -m "Initial deploy"
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repo, go to **Settings → Pages**
2. Under **Branch**, select `main` and folder `/` (root)
3. Click **Save**
4. GitHub gives you a URL like: `https://YOUR_USERNAME.github.io/gre-sprint/`

That's it — the app is live in 1–2 minutes.

---

## Set up real-time sync (so you see her progress live)

The app uses [JSONBin.io](https://jsonbin.io) as a free, lightweight data store. No server setup required.

### Step 1 — Get a free JSONBin API key

1. Go to [jsonbin.io](https://jsonbin.io) and sign up (free)
2. Go to **Account → API Keys**
3. Copy your **Master Key** (starts with `$2a$10b…`)

### Step 2 — She sets up the app (first time)

1. She opens the app URL on her Android
2. On first launch, the setup screen appears automatically
3. She taps **Add to Home Screen** in her browser menu (Chrome → three dots → Add to Home Screen) — it installs like a native app
4. She pastes the JSONBin Master Key and taps **Connect & Create Bin**
5. The app creates a private data bin and shows her the **Bin ID** — she sends it to you

### Step 3 — You connect on your iPhone

1. Open the same URL on your iPhone
2. Tap the setup screen → **Already have a Bin ID? Join existing**
3. Enter the Master Key and the Bin ID she sent
4. Tap **Join & Sync**
5. In Safari: tap the **Share button → Add to Home Screen** — installs as an app

Now both phones read and write the same data. Her progress appears on your Track tab within 60 seconds of any change she makes.

---

## If you want to use different JSONBin accounts

The Master Key is private — only use it on devices you trust. If you want separate read-only access for yourself, JSONBin's paid tier supports Access Keys, but the free Master Key shared between two trusted people (you and her) works fine.

---

## File structure

```
gre-pwa/
├── index.html       ← Main app shell (all UI)
├── style.css        ← All styles + PWA additions
├── data.js          ← 285 vocab words, 69 quiz Qs, 30-day plan, essay data
├── app.js           ← All logic + JSONBin sync + service worker registration
├── sw.js            ← Service worker (offline support)
├── manifest.json    ← PWA manifest (install prompt, icons, theme)
├── .nojekyll        ← Tells GitHub Pages not to process files with Jekyll
└── icons/
    ├── icon-192.png ← App icon (home screen)
    └── icon-512.png ← App icon (splash screen)
```

---

## Features

| Tab | What's in it |
|-----|-------------|
| **Plan** | 30-day daily plan with ⏱ time estimates, tap to check off |
| **Vocab** | 285 words across 19 decks, flip cards, mastered/review tracking |
| **Quiz** | 69 questions across 7 categories with instant explanations |
| **Essay** | 5-paragraph AWA template, scoring rubric, 5 rotating prompts |
| **Timer** | GRE-timed presets (Verbal 18m, Quant 21m, Essay 30m) + custom |
| **Track** | Live stats — days done, words mastered, quiz accuracy, day streak, weekly milestones |
| **Guide** | Test structure, shortcuts, quant cheat-sheet, all resources |

---

## Offline support

The service worker caches all app files on first load. The app works fully offline — vocab, quiz, plan, essay, and timer all run without internet. Progress syncs to JSONBin the next time there's a connection.

---

## Troubleshooting

**"The app isn't updating" on iPhone Safari**  
Safari caches aggressively. Hard-reload: Settings → Safari → Clear History and Website Data. Or open in a private tab once to clear cache.

**JSONBin sync stops working**  
Free JSONBin accounts have 10,000 reads/month and 1,000 writes/month. The app debounces writes (2s after last change) so for two people studying daily, you'll use ~60 writes/day maximum — well within the free tier.

**"Add to Home Screen" doesn't appear on iPhone**  
Must use Safari specifically (not Chrome on iOS) for the Add to Home Screen option.

**The service worker scope is wrong**  
If your GitHub Pages URL has a subfolder (e.g. `/gre-sprint/`), update `sw.js` line 1: change `/` paths to `/gre-sprint/` paths in the ASSETS array, and update `manifest.json`'s `start_url` and `scope` to `/gre-sprint/`.
