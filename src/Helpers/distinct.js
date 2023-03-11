const { createHash } = require("crypto");

/**
 *
 * @param {Object} jsonObject   An object that will be hashed
 * @returns                     A hash of the object passed in
 */
const hashObject = (jsonObject) => {
  return createHash("md5").update(JSON.stringify(jsonObject)).digest("hex");
};

/**
 * Recursive call to `distinct` to remove duplicates and produce a unique hash->object collection.
 *
 * @param {Array}  coll        A collection of objects that have at least an `_id` field
 * @param {Object} dedupMap    A object that indicates what sub-objects might need to be de-duplicated
 * Example:
 *    {fields: {dedupProcess: true,
 *              rules:        {dedupProcess: true}
 *             }
 *    }
 *
 *
 * @returns                    An object of hash->object so that each object can be uniquely identified by it's hash
 */
const hashCollection = (coll, dedupMap) => {
  if (coll) {
    //create a collection of fields that need to be de-duplicated. Identified where `dedupProcess` is `true`
    let subFields = Object.keys(dedupMap || {}).filter((key) => {
      if (dedupMap[key].dedupProcess) {
        return key;
      }
    });
    let resultantColl = coll.reduce((accum, currentValue) => {
      //make sure we de-duplicate any subfields within the current context
      subFields.map((subField) => {
        // recursive call here
        currentValue[subField] = distinct(
          currentValue[subField],
          dedupMap[subField]
        );
      });
      //remove id from current Value, create hash
      let { _id, ...rest } = currentValue; //TODO: maybe find a way to pass in the name of this field '_id'
      let hashedObject = hashObject(rest);
      //add result hash as ID and currentValue as value
      accum[hashedObject] = currentValue;
      return accum;
    }, new Map());
    return resultantColl;
  }
};

/**
 *
 * @param {Array}  coll        A collection of objects that have at least an `_id` field
 * @param {Object} dedupMap    A object that indicates what sub-objects might need to be de-duplicated
 * @returns                    The original collection except with duplicates that have been removed.
 *                             Duplicates are identified where all fields/values match except for the `_id` field
 */
const distinct = (coll, dedupMap) => {
  if (coll) {
    return Object.values(hashCollection(coll, dedupMap));
  }
};

module.exports = { distinct, hashObject, hashCollection };
