# Description
This app will deduplicate any `objects` and `fields` within the provided JSON file. Duplicates are identified by all matching fields/values except for any `_id` values. It will output a file named `clean_application.json` with the cleaned schema.

I opted to use a recursive technique for this solution, which can help with performance and scalability. However, the potential downside is that it can make it more difficult to maintain. An alternate way to solve this problem would be to "hard-code" different paths to inspect, but the largest downside there is scaling when other fields need de-duplication. I added more documentation that would help me and other developers when this code needs to be changed to assist in maintainability.


## How to Run
This requires an argument to be passed in and can be run using a command like the one below. The argument must be a JSON file the has a `versions` field. 

```
npm install
npm run dedupFile ./mock_application.json
```

## How to Test
Tests are written and executed in Jest.

```
npm test
```

## TODO
- [ ] Handle cases where we want children to de-duplicate, but not the parent entity
- [ ] Make the `_id` field a configurable argument
