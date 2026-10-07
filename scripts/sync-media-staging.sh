#!/usr/bin/env bash
# Stage files for R2 upload: mobile girki-media layout + web marketing assets.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE="${GIRKI_MOBILE_ROOT:-$ROOT/../girki/girki}"
DEST="$ROOT/media"

if [ ! -d "$MOBILE/media" ]; then
  echo "Missing $MOBILE/media — set GIRKI_MOBILE_ROOT if the app lives elsewhere." >&2
  exit 1
fi

rm -rf "$DEST"
mkdir -p "$DEST"

rsync -a "$MOBILE/media/" "$DEST/"

mkdir -p "$DEST/web/onboarding" "$DEST/web/home" "$DEST/web/experiences" "$DEST/web/marketing/app" "$DEST/web/videos" "$DEST/web/trust"

# Mobile app bundles (onboarding, mode tiles, fried-rice banner)
if [ -d "$MOBILE/assets/images/onboarding" ]; then
  cp "$MOBILE/assets/images/onboarding/"*.jpg "$DEST/web/onboarding/" 2>/dev/null || true
fi
if [ -f "$MOBILE/assets/images/home/fried-rice-banner.jpg" ]; then
  cp "$MOBILE/assets/images/home/fried-rice-banner.jpg" "$DEST/web/home/fried-rice-banner.jpg"
fi
if [ -d "$MOBILE/assets/images/experiences" ]; then
  cp "$MOBILE/assets/images/experiences/"* "$DEST/web/experiences/" 2>/dev/null || true
fi

# Web marketing images currently in public/
for f in \
  parties-celebrations.jpg \
  chef-wok-kitchen.jpg \
  chef-flour-portrait.jpg \
  date-night.jpg; do
  if [ -f "$ROOT/public/images/$f" ]; then
    cp "$ROOT/public/images/$f" "$DEST/web/marketing/$f"
  fi
done
if [ -f "$ROOT/public/images/how-it-works/chef-kitchen.jpg" ]; then
  cp "$ROOT/public/images/how-it-works/chef-kitchen.jpg" "$DEST/web/marketing/chef-kitchen.jpg"
fi
if [ -d "$ROOT/public/images/marketing" ]; then
  cp "$ROOT/public/images/marketing/"*.jpg "$DEST/web/marketing/" 2>/dev/null || true
  if [ -d "$ROOT/public/images/marketing/app" ]; then
    cp "$ROOT/public/images/marketing/app/"* "$DEST/web/marketing/app/" 2>/dev/null || true
  fi
fi
if [ -d "$ROOT/public/images/experiences" ]; then
  cp "$ROOT/public/images/experiences/"* "$DEST/web/experiences/" 2>/dev/null || true
fi
if [ -d "$ROOT/public/images/trust" ]; then
  cp "$ROOT/public/images/trust/"*.png "$DEST/web/trust/" 2>/dev/null || true
fi

for v in hero.mp4 private-dinner.mp4 date-night.mp4 corporate-events.mp4 meal-prep.mp4 parties-celebrations.mp4 vacation-chef.mp4; do
  if [ -f "$ROOT/public/videos/$v" ]; then
    cp "$ROOT/public/videos/$v" "$DEST/web/videos/$v"
  fi
done

# Chef portrait aliases (web chef ids vs mobile filenames)
if [ -f "$DEST/chefs/chidinma-eze.jpg" ] && [ ! -f "$DEST/chefs/chidinma.jpg" ]; then
  cp "$DEST/chefs/chidinma-eze.jpg" "$DEST/chefs/chidinma.jpg"
fi
if [ -f "$DEST/chefs/sophie/gallery-1.jpg" ] && [ ! -f "$DEST/chefs/sophie.jpg" ]; then
  cp "$DEST/chefs/sophie/gallery-1.jpg" "$DEST/chefs/sophie.jpg"
fi

# Legacy Ploy CDN marketing stills → web/marketing (skip if curl fails)
download() {
  local url="$1"
  local out="$2"
  if [ -f "$out" ]; then
    return 0
  fi
  curl -fsSL "$url" -o "$out" || echo "warn: could not download $url" >&2
}

download \
  'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-hero-private-chef-260813050731.webp' \
  "$DEST/web/marketing/hero.webp"
download \
  'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-private-dinner-experience-260813050741.webp' \
  "$DEST/web/marketing/private-dinner.webp"
download \
  'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-weekly-meal-prep-260813050736.webp' \
  "$DEST/web/marketing/meal-prep.webp"
download \
  'https://storage.googleapis.com/ployai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-date-night-experience-260814033355.webp' \
  "$DEST/web/marketing/date-night.webp"
download \
  'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-african-cuisine-table-260813050738.webp' \
  "$DEST/web/marketing/cuisine-table.webp"
download \
  'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/40cfeae9-girki-real-black-chef-portrait.webp' \
  "$DEST/web/marketing/chef-opportunity.webp"

echo "Staged $(find "$DEST" -type f | wc -l | tr -d ' ') files under $DEST"
