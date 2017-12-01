const ts = require('typescript');
const origin = require("metro-bundler/src/transformer").transform;
const SourceMap = require('source-map');
const fs = require('fs');
const path = require('path');

function decodeSourceMap(map, fn, content) {
  const smc = new SourceMap.SourceMapConsumer(map);
  const ret = [];
  smc.eachMapping(m => {
    if (m.name) {
      ret.push([m.generatedLine, m.generatedColumn, m.originalLine, m.originalColumn, m.name]);
    } else {
      ret.push([m.generatedLine, m.generatedColumn, m.originalLine, m.originalColumn]);
    }
  });
  return ret;
}

// Dirty: Fix slashes issue on windows.
ts.directorySeparator = path.sep;

exports.transform = function(options) {
  const configFn = ts.findConfigFile(options.filename, fs.existsSync);
  const config = configFn && ts.readConfigFile(configFn, fn => fs.readFileSync(fn, 'utf-8')).config;

  const out = ts.transpileModule(options.src, {
    fileName: options.filename,
    compilerOptions: config && config.compilerOptions,
  });

  return {
    code: out.outputText,
    filename: options.filename,
    map: out.sourceMapText && decodeSourceMap(out.sourceMapText, options.filename, options.src) || undefined,
  };
};


