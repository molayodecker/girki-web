#!/usr/bin/env bash
# Upload media/ to Cloudflare R2 bucket girki-media (public r2.dev or custom domain).
# Requires: npx wrangler login
set -euo pipefail

BUCKET="girki-media"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/media}"

if [ ! -d "$SRC" ]; then
  echo "No $SRC — run: pnpm media:sync" >&2
  exit 1
fi

cd "$SRC"
find . -type f | sort | while read -r file; do
  key="${file#./}"
  ext="$(echo "${key##*.}" | tr '[:upper:]' '[:lower:]')"
  case "$ext" in
    png) type="image/png" ;;
    webp) type="image/webp" ;;
    jpg | jpeg) type="image/jpeg" ;;
    mp4) type="video/mp4" ;;
    mov) type="video/quicktime" ;;
    *) type="application/octet-stream" ;;
  esac
  echo "↑ $key"
  npx --yes wrangler r2 object put "$BUCKET/$key" \
    --file "$file" \
    --content-type "$type" \
    --cache-control "public, max-age=86400" \
    --remote
done
