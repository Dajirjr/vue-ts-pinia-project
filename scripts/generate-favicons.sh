#!/bin/bash

# Create favicon directory if it doesn't exist
mkdir -p public/favicon

# Convert SVG to various PNG sizes
convert public/logos/icon/favicon.svg -resize 16x16 public/favicon/favicon-16x16.png
convert public/logos/icon/favicon.svg -resize 32x32 public/favicon/favicon-32x32.png
convert public/logos/icon/favicon.svg -resize 192x192 public/favicon/android-chrome-192x192.png
convert public/logos/icon/favicon.svg -resize 512x512 public/favicon/android-chrome-512x512.png
convert public/logos/icon/favicon.svg -resize 180x180 public/favicon/apple-touch-icon.png

# Create ICO file with multiple sizes
convert public/favicon/favicon-16x16.png public/favicon/favicon-32x32.png public/favicon/favicon.ico

echo "✅ Generated all favicon variants in public/favicon/" 