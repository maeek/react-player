const path = require('path');
const { config } = require('../config');
const util = require('../common');
const babel = require('@babel/core');
const chalk = require('chalk');

const processTypescript = (rootPath, files) => {
  const outDir = util.createDir(path.join(__dirname, '../..', config.outDir));

  files.forEach(async (file) => {
    const filePath = path.resolve(rootPath, file);

    try {
      const relativePath = util.getRelativePath(filePath);
      const filePathJs = relativePath.replace(path.extname(relativePath), '.js');
      const destFile = path.join(outDir, filePathJs);

      const babelResults = await babel.transformFileAsync(filePath, config.babelConfig);
      const transformedCode = config.postCompile?.length > 0
        ? config.postCompile.reduce((text, transformFunc) => transformFunc(text), babelResults.code)
        : babelResults.code;

      util.saveFile(destFile, transformedCode);
    }
    catch (e) {
      console.error();
      console.error(`[${chalk.red('✕')}] Failed to compile typescript file "${filePath}"`);
      console.error();
      console.error('Received error:');
      console.error();
      console.error(e);
      process.exit(1);
    }
  });
};

module.exports = {
  processTypescript
};
