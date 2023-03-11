const { dedupFile } = require("./src/app");

const processFile = (filename) => {
  let appSchema = require(filename);
  dedupFile(appSchema);
};

module.exports = {processFile};
