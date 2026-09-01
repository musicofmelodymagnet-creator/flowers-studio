#!/bin/bash
# Notify Bing/Yandex (IndexNow protocol) that pages changed, for faster indexing.
# Run this ON THE SERVER (has internet access) after deploying changed pages.
#
# Usage:
#   ./indexnow-ping.sh                                  # pings every URL in sitemap.xml
#   ./indexnow-ping.sh https://florinsky.ca/about.html   # pings only the given URL(s)
set -euo pipefail

KEY="0f12b8ab36dd46148440857cd2ed1ae0"
HOST="florinsky.ca"

if [ "$#" -eq 0 ]; then
  mapfile -t URLS < <(curl -s "https://florinsky.ca/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<loc>//;s#</loc>##')
else
  URLS=("$@")
fi

JSON_URLS=$(printf '%s\n' "${URLS[@]}" | sed 's/.*/"&"/' | paste -sd, -)

curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"urlList\":[$JSON_URLS]}" \
  -w "\nHTTP_STATUS:%{http_code}\n"
