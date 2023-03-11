const { distinct } = require("./Helpers/distinct");
const fs = require("fs");
/**
 * An object that indicates what parts of the input JSON will be de-duplicated.
 * The `dedupProcess` key with a value of `true` identifies which keys will be
 * de-duplicated.
 *
 * CAUTION: The structure here must match the input JSON structure within the
 * `versions` key since the two maps are processed in parallel.
 */
const dedupMap = {
  objects: { dedupProcess: true, fields: { dedupProcess: true } },
};

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
    console.log("Data was successfully stored in:", path);
  } catch (err) {
    console.error(err);
  }
};

/**
 * 
 * @param {Object} appSchema An object with least a `versions` field that is a collection
 * 
 * Processes the given object schema and outputs de-duplicated results to `clean_application.json`.
 */
const dedupFile = (appSchema) => {
  Object.keys(dedupMap).forEach((key) => {
    //FIXME: will not account for nested keys where the parent doesn't dedup
    if (dedupMap[key].dedupProcess) {
      appSchema.versions[0][key] = distinct(
        appSchema.versions[0][key],
        dedupMap[key]
      );
    }
  });
  storeData(appSchema, "./clean_application.json");
};
module.exports = {dedupFile};
