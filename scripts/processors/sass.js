const { config } = require('../config');
const util = require('../common');
const path = require('path');
const sass = require('sass');
const postcss  = require('postcss');
const fs = require('fs-extra');
const chalk = require('chalk');

const processScss = (rootPath) => {
  let cssFiles = util.getScssFiles(rootPath);
  let fullPath = rootPath;
  let appendPath = '';
  const altPath = path.resolve(rootPath, config.stylesFolder);
  
  if (cssFiles.length === 0 && fs.existsSync(altPath)) {
    appendPath = config.stylesFolder;
    cssFiles = util.getScssFiles(altPath);
    fullPath = path.join(rootPath, appendPath);
  }
  
  const outDir = util.createDir(path.join(__dirname, '../..', config.outDir));
  const relativePath = util.getRelativePath(rootPath);
  
  // Do not process scss _partials as entry files
  const cssFilesToProcess = cssFiles.filter(file => !file.startsWith('_'));
  
  cssFilesToProcess.forEach(async (file) => {
    const filePath = path.resolve(fullPath, file);

    try {
      const newFileName = file.replace(path.extname(file), '.css');
      const destPath = path.join(outDir, relativePath, appendPath, newFileName);

      const processed = sass.renderSync({
        file: filePath,
        ...config.sass
      });
      const renderedCss = processed.css.toString('utf-8');

      const processedCss = await postcss(config.postcss?.plugins || [])
        .process(renderedCss, {
          from: path.resolve(fullPath, file),
          to: destPath,
          map: true
        });

      util.saveFile(destPath, processedCss.css);
    }
    catch(e) {
      console.error();
      console.error(`[${chalk.red('✕')}] Failed to compile scss file "${filePath}"`);
      console.error();
      console.error('Received error:');
      console.error();
      console.error(e);
      process.exit(1);
    }
  });  

  // Copy original scss files to components folder
  cssFiles.forEach((file) => {
    util.copyFiles([ path.resolve(fullPath, file) ], path.join(outDir, relativePath, appendPath));
  });
};

module.exports = {
  processScss
};
