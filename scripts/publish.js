/* eslint-disable no-console */
const path = require('path');
const childProc = require('child_process');
const chalk = require('chalk');

const pkg = require('../package.json');

try {
  const result = childProc.execSync('npm publish', {
    cwd: path.resolve(__dirname, '..', 'dist')
  }).toString();
  
  console.log(result);
}
catch (e) {
  console.error();
  console.error(`[${chalk.red('✕')}] Failed to publish new package version`);
  console.error();
  console.error(`Version in package.json: ${pkg.version}`);
  console.error();
  console.error(e);
  process.exit(1);
}
