#!/bin/bash

# Set output file name
ZIP_NAME="launch-assets.zip"
OUTPUT_DIR="public"

echo "🧩 Zipping VisionBoard AI launch assets..."

# Paths to include
INCLUDE_PATHS=(
  "$OUTPUT_DIR/logos"
  "$OUTPUT_DIR/screenshots"
  "$OUTPUT_DIR/marketing"
  "$OUTPUT_DIR/badges"
  "$OUTPUT_DIR/overlays"
  "$OUTPUT_DIR/favicon"
  "$OUTPUT_DIR/index.html"
  "$OUTPUT_DIR/site.webmanifest"
)

# Create zip
zip -r $ZIP_NAME "${INCLUDE_PATHS[@]}"

echo "✅ Done! Created $ZIP_NAME in project root." 