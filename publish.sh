#!/bin/bash
set -e
set -x
npm run build
npx next export
git rev-parse --short HEAD >> out/published-commit-ids.html
chmod -R o+r out

# Edit these two lines to match your own server and username.
#rsync -aP out/ jiamingsun@do.jiamingsun.ml:homepage/
#ssh jiamingsun@do.jiamingsun.ml "chown -R jiamingsun:www-data ~/homepage"