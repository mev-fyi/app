rm -rf node_modules/
rm -f package-lock.json
rm -f  yarn.lock
rm -f  pnpm-lock.yaml
npm cache clean --force
npm install
pnpm install
