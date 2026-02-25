# Kaso Design

Kaso is the Flower branding and design module inside Peacae.com, a creative platform in the Wekify LLC ecosystem.

This app is the working design studio for Kaso: a React-based editor for creating branded social cards and banner graphics at platform-ready sizes.

It lets you edit content, theme, typography, layout, and icon style in real time, then export high-resolution PNG assets instantly.

## Highlights

- Live visual preview while editing
- Platform presets:
  - Twitter/X (`1500 x 500`)
  - LinkedIn (`1584 x 396`)
  - Facebook (`820 x 312`)
  - Instagram (`1080 x 1080`)
  - OG/Blog (`1200 x 630`)
- Multiple visual themes and typography pairings
- Layout modes (`left`, `center`, `split`)
- Icon options (`tile`, `bare`, `circle`) with optional HQ mark
- Optional divider and watermark
- Full-resolution PNG export via canvas renderer
- Preset import/export as JSON
- Local autosave (restores last design state)

## Brand Context (from identity document, February 2026)

- Name: `Kaso`
- Meaning: `Flower` (Kifuliiru language, Eastern Congo)
- Symbolism:
  - Flower: growth, creativity, natural beauty, cultural roots
  - Compass: direction and navigation
- Platform: `Peacae.com`
- Parent company: `Wekify LLC`
- Category: Branding and Design Module

## Tech Stack

- React 18
- Vite 5
- Plain CSS (no UI framework)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run local dev server

```bash
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

### 3. Create production build

```bash
npm run build
```

### 4. Preview production build locally

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production assets into `dist/`
- `npm run preview` - Serve production build locally

## Project Structure

```text
kaso-design/
  index.html
  package.json
  src/
    App.jsx        # App UI + canvas rendering logic
    main.jsx       # React entrypoint
    styles.css     # Global and component styling
```

## How the App Works

1. You update text, platform, styling, and layout in the sidebar.
2. The preview updates immediately using React state.
3. On download, the app renders the same config to an offscreen canvas.
4. The canvas is exported as a PNG at exact target dimensions.

## Presets and Autosave

- **Autosave**: Current config is stored in `localStorage` key `kaso-design-v1`.
- **Export preset**: Downloads the current config as JSON.
- **Import preset**: Loads a previously exported JSON config.
- **Reset**: Restores default app values.

## Customization Guide

Core configuration objects live in [`src/App.jsx`](/Users/ayivugwekabemba/development/kaso-design/src/App.jsx):

- `PLATFORMS`: add/update output dimensions
- `THEMES`: control colors, gradients, accents, tiles
- `FONT_PAIRS`: choose title/body/meta font combos
- `LAYOUTS` and `ICON_STYLES`: available UI options

If you add a new platform or theme, both preview and export will pick it up automatically because they use shared config constants.

## Kaso Brand Palette

| Name | Hex | Role |
|---|---|---|
| Deep Teal | `#1A7A6A` | Primary |
| Teal | `#2AA88C` | Primary |
| Jade | `#4DB896` | Accent |
| Mint | `#6DDCB4` | Accent |
| Night | `#0D1F1C` | Neutral |
| Mist | `#EDF5F2` | Neutral |

The app now includes Kaso-first themes (`Kaso Light`, `Kaso Dark`, `Kaso Gradient`) aligned to this palette.

## Usage Guidelines

Do:
- Use the light logo/theme on clean light backgrounds
- Use dark variants on dark surfaces
- Keep clear spacing around marks
- Prefer the Kaso gradient accents in icon-focused assets

Do not:
- Recolor marks in non-brand colors
- Rotate or distort the flower mark
- Mix Kaso teal palette with Kifuliiru rust palette in one composition

## Troubleshooting

### Blank screen in browser

1. Open browser DevTools Console and check the first red error.
2. Ensure dependencies are installed: `npm install`.
3. Restart dev server: stop then run `npm run dev` again.
4. Hard refresh browser (`Cmd+Shift+R` on macOS).

### Fonts look wrong

The app uses Google Fonts in `index.html`. Verify internet access or replace fonts with local/self-hosted versions.

### Download not working

Some browsers block automatic downloads in strict settings. Allow downloads for localhost and retry.

## Deployment

Any static host works (Vercel, Netlify, Cloudflare Pages, GitHub Pages):

1. Run `npm run build`
2. Deploy `dist/`

## Roadmap Ideas

- Batch export all platform sizes in one click
- Named preset gallery
- Multiple brand kits
- SVG/PDF export modes
- Image/background uploads

## License

Proprietary unless you choose to add an open-source license.
