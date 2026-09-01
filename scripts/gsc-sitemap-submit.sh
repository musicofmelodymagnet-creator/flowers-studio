#!/bin/bash
# Force Google to re-fetch florinsky.ca's sitemap immediately via the official
# Search Console API, instead of waiting for Google's own crawl schedule.
# Run this ON THE SERVER (has internet access + the service account key).
#
# Auth: JWT Bearer flow for the "florinsky-search-console" service account,
# which is added as a Full user on the florinsky.ca property in Search Console.
set -euo pipefail

KEY_FILE="/home/florinsky/secrets/gsc-service-account.json"
SITE="sc-domain:florinsky.ca"
SITEMAP_URL="https://florinsky.ca/sitemap.xml"

CLIENT_EMAIL=$(python3 -c "import json; print(json.load(open('$KEY_FILE'))['client_email'])")
PRIVATE_KEY=$(python3 -c "import json; print(json.load(open('$KEY_FILE'))['private_key'])")

PEM_FILE=$(mktemp)
trap 'rm -f "$PEM_FILE"' EXIT
printf '%s' "$PRIVATE_KEY" > "$PEM_FILE"

b64url() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }

NOW=$(date +%s)
EXP=$((NOW + 3600))

HEADER='{"alg":"RS256","typ":"JWT"}'
CLAIMS=$(printf '{"iss":"%s","scope":"https://www.googleapis.com/auth/webmasters","aud":"https://oauth2.googleapis.com/token","exp":%d,"iat":%d}' "$CLIENT_EMAIL" "$EXP" "$NOW")

HEADER_B64=$(printf '%s' "$HEADER" | b64url)
CLAIMS_B64=$(printf '%s' "$CLAIMS" | b64url)
SIGNING_INPUT="${HEADER_B64}.${CLAIMS_B64}"
SIGNATURE=$(printf '%s' "$SIGNING_INPUT" | openssl dgst -sha256 -sign "$PEM_FILE" | b64url)
JWT="${SIGNING_INPUT}.${SIGNATURE}"

ACCESS_TOKEN=$(curl -s -X POST https://oauth2.googleapis.com/token \
  -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" \
  --data-urlencode "assertion=$JWT" | python3 -c "import json,sys; print(json.load(sys.stdin)['access_token'])")

ENCODED_SITE=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$SITE', safe=''))")
ENCODED_SITEMAP=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$SITEMAP_URL', safe=''))")

curl -s -X PUT \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE}/sitemaps/${ENCODED_SITEMAP}" \
  -w "\nHTTP_STATUS:%{http_code}\n"
