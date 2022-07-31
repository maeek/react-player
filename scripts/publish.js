/* eslint-disable no-console */
const path = require('path');
const util = require('./common');
const childProc = require('child_process');
const chalk = require('chalk');

const pkgPath = path.resolve(__dirname, '..', 'package.json');

util.copyFiles([ pkgPath ]);

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
  console.error(`Version in package.json: ${pkgPath.version}`);
  console.error();
  console.error(e);
  process.exit(1);
}
