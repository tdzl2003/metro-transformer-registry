# Metro-Transformer-Registry

Use different transformers in [metro-bundler](https://npmjs.com/package/metro-bundler), which is the main bundler for [react-native](https://facebook.github.io/react-native)

## Usage

First install dependencies:

```bash
yarn add metro-transformer-registry
```

Config your 'rn-cli.config.js'

```javascript
'use strict';

const path = require('path');
const blacklist = require('metro-bundler/src/blacklist');

const config = {
  // Define file extensions for every source code.
  getSourceExts() {
    return ['js', 'json', 'ts', 'tsx', 'txt'];
  },

  // Use Metro-Transformer-Registry as transformer entry.
  getTransformModulePath() {
    return require.resolve('metro-transformer-registry');
  },

  // Define every rule list.
  getTransformRuleList() {
    return [
      {
        include: '/\.tsx?$',
        transformer: require('metro-transformer-registry/transformers/typescript'),
      },
      {
        include: '/\.txt$',
        transformer: require('metro-transformer-registry/transformers/raw'),
      },
    ]
  }
};

module.exports = config;
```

If you wish to use typescript with react native, you also should install following dependencies: 

```bash
yarn add typescript sourcemap
```

and add a tsconfig.json file:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "sourceMap": true,
    "jsx": "react",
    "strict": true,
    "importHelpers": true,
    "noImplicitAny": true,
    "experimentalDecorators": true,
    "outDir": "./lib",
    "rootDir": "./src",
    "lib": [
      "es5",
      "es6",
      "es2015",
      "DOM"
    ]
  },
  "compileOnSave": false,
  "exclude": [
    "node_modules"
  ]
}
```
