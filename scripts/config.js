const tsconfig = require('../tsconfig.json');
const babelCfg = require('../babel.config');
const autoprefixer = require('autoprefixer');

const config = {
  entryFolder: 'src',
  outDir: tsconfig.compilerOptions.outDir,
  stylesFolder: 'styles',
  exclude: [
    /^styles$/,
    /^stories$/,
    /^tests$/,
    /^setup-tests.ts$/,
    /.*\.d\.ts/,
    /.*\.stories\..*/,
    /.*\.test\..*/,
    /.*\.mock\..*/
  ],
  babelConfig: babelCfg,
  sass: {},
  postcss: {
    plugins: [ autoprefixer ]
  },
  postCompile: [
    (code) => code.replace(/require\("(.+)\.scss"\)/gm, 'require("$1.css")')
  ]
};

module.exports = {
  config
};
