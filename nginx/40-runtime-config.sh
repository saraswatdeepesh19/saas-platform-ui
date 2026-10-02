#!/bin/sh
set -eu

if [ -z "${SENTRY_DSN:-}" ]; then
  exit 0
fi

case "$SENTRY_DSN" in
  *[!A-Za-z0-9._:/@?&=%-]*)
    echo "SENTRY_DSN contains unsupported characters" >&2
    exit 1
    ;;
esac

printf 'window.__SAAS_PLATFORM_CONFIG__ = { sentryDsn: "%s" };\n' "$SENTRY_DSN" \
  > /usr/share/nginx/html/runtime-config.js