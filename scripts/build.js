/* eslint-disable max-len */
/* eslint-disable no-console */
const path = require('path');
const chalk = require('chalk');
const { config } = require('./config');
const util = require('./common');
const { processScss } = require('./processors/sass');
const { processTypescript } = require('./processors/typescript');

console.log();

const loadedModulesFlat = util.getEntries(path.resolve(__dirname, '..', config.entryFolder));

console.log();
console.log();
console.log(`Compiling ${loadedModulesFlat.reduce((acc, curr) => acc + curr.meta.count, 0)} files...`);
console.log();
console.time(`[${chalk.green('✓')}] Compilation ended successfuly in`);

const longestNameLength = loadedModulesFlat.reduce((acc, curr) => {
  const len = curr.meta.type.length + curr.meta.name.length + 25;
  return acc > len ? acc : len;
}, 0);

loadedModulesFlat.forEach((mod) => {
  const insertTabs = longestNameLength - `[x] [${chalk.gray(mod.meta.type)}][${mod.meta.name}]`.length;

  try {
    console.time(`[${chalk.green('✓')}] [${chalk.gray(mod.meta.type)}][${mod.meta.name}]${new Array(insertTabs).join(' ')} Compilation successful, time elapsed`);

    if (mod.meta.typescriptCount > 0) {
      processTypescript(mod.rootPath, mod.files.typescript);
    }
    
    if (mod.meta.scssCount > 0) {
      processScss(mod.rootPath);
    }

    console.timeEnd(`[${chalk.green('✓')}] [${chalk.gray(mod.meta.type)}][${mod.meta.name}]${new Array(insertTabs).join(' ')} Compilation successful, time elapsed`);
  } catch (e) {
    console.log(`[${chalk.red('✕')}] [${chalk.gray(mod.meta.type)}][${mod.meta.name}]${new Array(insertTabs).join(' ')} Compilation failure`);
    console.log();
    console.error(e);
  }
});

util.copyFiles(
  [ path.resolve(__dirname, '..', 'src') ],
  path.resolve(__dirname, '..', 'dist')
);

console.log();
console.timeEnd(`[${chalk.green('✓')}] Compilation ended successfuly in`);
console.log();
console.log('    Summary:');
console.log();
console.log(`        Scss files:        ${loadedModulesFlat.reduce((acc, curr) => acc + curr.meta.scssCount, 0)}`);
console.log(`        Typescript files:  ${loadedModulesFlat.reduce((acc, curr) => acc + curr.meta.typescriptCount, 0)}`);
console.log();
console.log(`        All files:         ${loadedModulesFlat.reduce((acc, curr) => acc + curr.meta.count, 0)}`);
console.log();
