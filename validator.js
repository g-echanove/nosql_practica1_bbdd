// Node.js require:
const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
addFormats(ajv);

const schema = require('./banda.schema.json');
const data = require('./banda.json');

const validate = ajv.compile(schema);
const valid = validate(data);
if (valid) {
  console.log("JSON VALIDO!");
} else {
  console.log(validate.errors);
}