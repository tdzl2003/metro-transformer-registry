exports.transform = function(options) {
  return {
    code: `module.exports = ${JSON.stringify(options.src)}`,
    filename: options.filename,
  };
};


