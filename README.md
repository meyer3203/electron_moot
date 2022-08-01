# Setup

1. In the root of the project, run `npm run start`
2. In src/svelte, run `npm run dev`


# Distribution

1. npm run dist
2. node src/sign.js
3. node src/notarize.js (takes a few minutes)

note: sign and notarize need the following env vars
APP_DIR (e.g. ./moot-darwin-x64/moot.app)
APPLE_ID
APPLEIDPASS
