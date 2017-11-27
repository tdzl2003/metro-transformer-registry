const ts = require('typescript');
const origin = require("metro-bundler/src/transformer").transform;
const SourceMap = require('source-map');
const fs = require('fs');
const path = require('path');

function decodeSourceMap(map, fn, content) {
  const smc = new SourceMap.SourceMapConsumer(map);
  const outMap = new SourceMap.SourceMapGenerator();
  outMap.setSourceContent(fn, content);

  smc.eachMapping(({
    source,
    generatedLine,
    generatedColumn,
    originalLine,
    originalColumn,
    name,
  }) => {
    outMap.addMapping({
      generated: { line: generatedLine, column: generatedColumn },
      original: { line: originalLine, column: originalColumn },
      source: fn,
      name: name,
    })
  })
  return outMap.toJSON();
}

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
    map: decodeSourceMap(out.sourceMapText, options.filename, options.src),
  };
};


