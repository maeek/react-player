const fs = require('fs-extra');
const path = require('path');
const pkg = require('../package.json');

// The legacy publisher publishes dist directly; npm pack publishes the root.
const { scripts, devDependencies, files, ...manifest } = pkg;
manifest.main = 'index.js';
manifest.types = 'index.d.ts';
fs.writeJsonSync(path.resolve(__dirname, '../dist/package.json'), manifest, { spaces: 2 });
if (fs.existsSync(path.resolve(__dirname, '../README.md'))) {
  fs.copyFileSync(path.resolve(__dirname, '../README.md'), path.resolve(__dirname, '../dist/README.md'));
}
