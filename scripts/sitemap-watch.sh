#!/bin/bash
# Runs on a schedule via cron. Checks whether sitemap.xml changed since the
# last run; if so (and only during allowed hours), notifies IndexNow
# (Bing/Yandex) and Google Search Console so new/changed pages get indexed
# faster, instead of waiting for a manual deploy-time ping.
#
# Quiet hours: 22:00-10:00 America/Toronto -- no pings sent in that window.
# A change detected during quiet hours is NOT lost: the hash file is only
# updated after a successful ping, so the next run once the window reopens
# will still see the change and send it then.
set -euo pipefail

SCRIPT_DIR="/home/florinsky/scripts"
HASH_FILE="$SCRIPT_DIR/.sitemap-hash"
LOG_FILE="$SCRIPT_DIR/sitemap-watch.log"
SITEMAP_URL="https://florinsky.ca/sitemap.xml"

log() { echo "$(TZ=America/Toronto date '+%Y-%m-%d %H:%M:%S %Z') $1" >> "$LOG_FILE"; }

HOUR=$(TZ=America/Toronto date +%H)
if [ "$HOUR" -ge 22 ] || [ "$HOUR" -lt 10 ]; then
  log "skip: quiet hours (Toronto ${HOUR}:00)"
  exit 0
fi

CURRENT_HASH=$(curl -s "$SITEMAP_URL" | sha256sum | awk '{print $1}')
PREVIOUS_HASH=$(cat "$HASH_FILE" 2>/dev/null || echo "")

if [ "$CURRENT_HASH" = "$PREVIOUS_HASH" ]; then
  log "skip: no sitemap change"
  exit 0
fi

log "change detected, notifying Bing/Yandex + Google"
"$SCRIPT_DIR/indexnow-ping.sh" >> "$LOG_FILE" 2>&1
"$SCRIPT_DIR/gsc-sitemap-submit.sh" >> "$LOG_FILE" 2>&1

echo "$CURRENT_HASH" > "$HASH_FILE"
log "done, hash updated"
