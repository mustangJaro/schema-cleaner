const {
  hashObject,
  hashCollection,
  distinct,
} = require("../../src/Helpers/distinct");

test("Hashes objects successfully", () => {
  expect(hashObject("123")).toBe("757d204b68e8e1c419288694ab908f55");
});

describe("hashCollection tests", () => {
  test("Success with undefined args", () => {
    expect(hashCollection(undefined, undefined)).toBeUndefined();
  });
  test("Returns empty map when passed empty collection and undefined dedupMap", () => {
    expect(hashCollection([], undefined)).toEqual(new Map());
  });
  test("Returns empty map when passed base collection and undefined dedupMap", () => {
    expect(hashCollection([{}], undefined)).toEqual(new Map());
  });
  test("Returns de-duplicated map when passed basic collection and undefined dedupMap", () => {
    const result = hashCollection(
      [
        { _id: "123", data: "567" },
        { _id: "234", data: "567" },
      ],
      undefined
    );
    expect(Object.keys(result)).toEqual(["19d458087669abc2e88693ddf2118d04"]);
    expect(Object.values(result)).toEqual([{ _id: "234", data: "567" }]);
  });
});

describe("distinct tests", () => {
  test("Success with undefined args", () => {
    expect(distinct(undefined, undefined)).toBeUndefined();
  });
  test("Returns empty array when passed an empty array", () => {
    expect(distinct([], undefined)).toEqual([]);
  });
  test("Returns de-duplicated collection when passed basic collection and undefined dedupMap", () => {
    const result = distinct(
      [
        { _id: "123", data: "567" },
        { _id: "234", data: "567" },
        { _id: "345", data: "567", values: [1, 2] },
      ],
      undefined
    );
    expect(result).toEqual([
      { _id: "234", data: "567" },
      { _id: "345", data: "567", values: [1, 2] },
    ]);
  });
  test("Returns de-duplicated collection when passed basic collection and empty dedupMap", () => {
    const result = distinct(
      [
        { _id: "123", data: "567" },
        { _id: "234", data: "567" },
        { _id: "345", data: "567", values: [1, 2] },
      ],
      {}
    );
    expect(result).toEqual([
      { _id: "234", data: "567" },
      { _id: "345", data: "567", values: [1, 2] },
    ]);
  });
  test("Returns de-duplicated collection when passed basic collection and a dedupMap", () => {
    const result = distinct(
      [
        { _id: "123", data: "567" },
        { _id: "234", data: "567" },
        {
          _id: "345",
          data: "567",
          fields: [
            { _id: "abc", type: "User" },
            { _id: "bcd", type: "User" },
          ],
        },
      ],
      { fields: { dedupProcess: true } }
    );
    expect(result).toEqual([
      { _id: "234", data: "567" },
      { _id: "345", data: "567", 
      fields: [
        { _id: "bcd", type: "User" },
      ], },
    ]);
  });
});
