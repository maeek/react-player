const path = require('path');
const fs = require('fs-extra');
const { config } = require('./config');

const getRelativePath = (rootPath) => rootPath.replace(
  path.resolve(__dirname, '..', config.entryFolder),
  ''
);

const getFolders = (rootPath) => {
  return fs.readdirSync(rootPath)
    .filter((folder) => fs.statSync(path.join(rootPath, folder)).isDirectory() && folder);
};

const getFilesWithExt = (exts = [], rootPath) => {
  return fs.readdirSync(rootPath)
    .filter((file) => fs.statSync(path.join(rootPath, file)).isFile() && file)
    .filter((file) => exts.includes(path.extname(file)));
};

const filterNonProductionFiles = (fileList = []) => {
  const nonProd = config.exclude;

  return fileList.filter((file) => {
    let include = true;

    nonProd.forEach((regex) => {
      if (regex.test(file)) include = false;
    });

    return include;
  });
};

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return dir;
};

const copyFiles = (files = [], destination = path.join(__dirname, '..', config.outDir)) => {
  files.forEach((file) => {
    fs.copySync(file, path.join(destination, path.basename(file)));
  });
};

const getScssFiles = (rootPath) => getFilesWithExt([ '.scss' ], rootPath);
const getTypescriptFiles = (rootPath) => getFilesWithExt([ '.ts', '.tsx' ], rootPath);

const saveFile = (filepath, data) => {
  createDir(path.dirname(filepath));
  fs.writeFileSync(filepath, data, { encoding: 'utf-8' });
};

const getEntries = (rootPath, arr = []) => {
  const folders = filterNonProductionFiles(getFolders(rootPath));
  const stylesFolderExists = fs.existsSync(path.resolve(rootPath, config.stylesFolder));
  const relativePath = getRelativePath(rootPath) || '/src';

  let componentType = path.dirname(relativePath).substr(1);
  componentType = (componentType.startsWith('components') 
    ? componentType.substr(11) 
    : componentType) || path.basename(relativePath);

  // atom, molecule..
  const type = componentType.substr(0, componentType.indexOf('/') || componentType.length) || componentType;
  const name = path.basename(relativePath);

  const typescript = filterNonProductionFiles(getTypescriptFiles(rootPath));
  const scss = filterNonProductionFiles(getScssFiles(
    stylesFolderExists 
      ? path.resolve(rootPath, config.stylesFolder) 
      : rootPath
  ));

  if (componentType) {
    arr.push({
      rootPath,
      relativePath,
      meta: {
        type,
        name: name === type ? 'index' : name,
        componentType,
        typescriptCount: typescript.length,
        scssCount: scss.length,
        count: typescript.length + scss.length
      },
      files: {
        typescript,
        scss
      }
    });
  }
  folders.forEach((folder) => {
    const buildPath = path.join(rootPath, folder);
    getEntries(buildPath, arr);
  });
  
  return arr.filter((f) => f.meta.count > 0);
};

module.exports = {
  getRelativePath,
  getFolders,
  getFilesWithExt,
  getScssFiles,
  getTypescriptFiles,
  createDir,
  saveFile,
  filterNonProductionFiles,
  copyFiles,
  getEntries
};
