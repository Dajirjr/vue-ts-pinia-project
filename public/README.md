# 🎨 VisionBoard AI – Asset System

This folder contains all design, branding, and launch media assets.

---

## 📁 Folder Overview

| Folder           | Purpose                                          |
|------------------|--------------------------------------------------|
`/logos/dark`      | Logos for light backgrounds (PNG, SVG)           |
`/logos/light`     | Logos for dark backgrounds                       |
`/logos/icon`      | App icons, favicon files                         |
`/screenshots`     | Gallery images for Product Hunt / Readme         |
`/overlays`        | Framing overlays (Figma/PNG) for mockups        |
`/marketing`       | Social banners, Instagram carousels              |
`/badges`          | Tech stack badges for GitHub and PH              |
`/favicon`         | Webmanifest, favicons (Apple, Android, etc.)     |

---

## 🧰 Tools

- `index.html`: Local PNG export tool
- `convert-images.js`: Script-based conversion (optional)
- `scripts/generate-launch-assets.sh`: Zips assets for distribution

---

## 📦 Asset Sizes

| Asset Type        | Dimensions                | Usage                    |
|------------------|---------------------------|--------------------------|
| Logo (Large)     | 512×512px                | Maximum Resolution      |
| Logo (Medium)    | 128×128px                | Standard Icon           |
| Logo (Small)     | 64×64px                  | Favicon                 |
| QR Code          | 300×300px                | Marketing Materials     |
| Product Hunt     | 1200×630px, 1080×1080px  | Launch Banners         |
| Favicons         | 16px to 512px            | Various Platforms       |

---

## 🎯 Brand Guidelines

### Colors
- Primary: `#4F46E5` (Indigo)
- Secondary: `#3B82F6` (Blue)
- Dark Theme: `#0F172A`

### Typography
- Font: Inter (400, 500, 600, 700)
- Use white text on dark backgrounds
- Maintain consistent line heights

### Design Elements
- Glassmorphism effects
- 8px border radius
- Primary/secondary gradients
- Dark UI with high contrast

---

## 🚀 Quick Start

1. Generate PNGs:
   ```bash
   # Open in browser
   open public/index.html
   ```

2. Create launch package:
   ```bash
   # Run the script
   ./scripts/generate-launch-assets.sh
   ```

3. Upload to releases:
   ```bash
   # Tag and upload
   git tag v1.0.0-launch
   git push origin v1.0.0-launch
   ```

---

## 🎯 Use Cases

- GitHub README media
- Product Hunt banners
- Launch blog visuals
- Demo video overlays
- Social media assets

---

## 📝 Best Practices

1. Use dark logos on light backgrounds
2. Use light logos on dark backgrounds
3. Keep SVGs as source files
4. Generate PNGs on-demand
5. Follow platform-specific guidelines

# VisionBoard AI Marketing Assets

This directory contains all marketing assets for VisionBoard AI, organized for easy access and consistency.

## Directory Structure

```
public/
├── badges/            # Tech stack badges
├── logos/            # Brand logos
│   ├── dark/        # Dark theme logos
│   ├── light/       # Light theme logos
│   └── icon/        # Icon-only variants
├── screenshots/      # Application screenshots
│   └── gallery/     # Gallery screenshots (1270×760px)
└── marketing/       # Marketing campaign assets
    └── product-hunt/ # Product Hunt launch assets
        └── video/   # Product demo video assets
```

## Brand Guidelines

### Colors
- Primary: `#4F46E5` (Indigo)
- Secondary: `#3B82F6` (Blue)
- Dark Theme: `#0F172A`

### Typography
- Font Family: Inter
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Design Elements
- Glassmorphism effects with subtle transparency
- Consistent rounded corners (8px radius)
- Gradient combinations of primary/secondary colors
- White text on dark backgrounds for contrast

## Asset Specifications

### Screenshots
- Dimensions: 1270×760 pixels
- Format: PNG with transparency
- Style: Dark theme with glassmorphism effects

### Logos
- Dark/Light variants
- Icon-only version (512×512px, 240×240px)
- SVG format for scalability

### Tech Stack Badges
- Dimensions: 120×40 pixels
- Style: Gradient background with white text
- Format: SVG with embedded Inter font

### Product Hunt Assets
- Banner: 1200×630 pixels
- Video: 1920×1080 @ 60fps
- Captions: White text, Inter font
- Watermark: Bottom right corner

## Required Screenshots

1. Dashboard + Focus Timer
2. AI Weekly Summary
3. Calendar Sync View
4. PDF Export View
5. Settings Page

## Video Guidelines

- Duration: 90 seconds
- Resolution: 1920×1080 @ 60fps
- Audio: Background music (optional)
- Transitions: Smooth fade between scenes
- Captions: White text with dark outline
- Watermark: Bottom right, 20% opacity 