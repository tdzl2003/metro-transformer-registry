const path = require('path');
const fs = require('fs');

const ruleList = getRuleList();

const origin = require("metro-bundler/src/transformer");

function test(regOrFunc, fn) {
  if (typeof regOrFunc === 'function') {
    return regOrFunc(fn);
  }
  if (typeof regOrFunc.test === 'function') {
    return regOrFunc.test(fn);
  }
  return false;
}

function testRule(rule, fn) {
  if (rule.include && !test(rule.include, fn)) {
    return false;
  }
  if (rule.test && !test(rule.test, fn)) {
    return false;
  }
  if (rule.exclude && test(rule.exclude, fn)) {
    return false;
  }
  return true;
}

exports.transform = function transform(options) {
  for (const rule of ruleList) {
    if (testRule(rule, options.filename)) {
      return rule.transformer.transform(options);
    }
  }
  return origin.transform(options);
}


function getRuleList() {
  const fn = path.resolve('rn-cli.config.js');
  if (!fs.existsSync(fn)) {
    return [];
  }
  const config = require(fn);
  return config.transformRuleList ||
    config.getTransformRuleList && config.getTransformRuleList()
}
