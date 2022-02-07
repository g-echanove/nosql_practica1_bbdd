/* eslint-disable no-invalid-this*/
/* eslint-disable no-undef*/
// IMPORTS
const path = require("path");
const Utils = require("./testutils");
const fs = require("fs");
const User = require('../user.json');

const path_assignment = path.resolve(path.join(__dirname, "../", "banda.json"));
const path_assignment2 = path.resolve(path.join(__dirname, "../", "banda.schema.json"));

// CRITICAL ERRORS
let error_critical = null;

const Ajv = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
addFormats(ajv);

//variable para leer el fichero json y procesarlo solo una vez, cuando se que existe y tiene formato JSON válido
let banda;
//variable para leer el esquema json y procesarlo solo una vez, cuando se que existe y tiene formato JSON válido
let bandaschema;

// TESTS
describe("JSON Tests:", function () {
    it("1(Precheck): Comprobando que existen los ficheros de la entrega...", async function () {
        this.name = "";
        this.score = 0;
        this.msg_ok = `Encontrados los ficheros '${path_assignment}' y '${path_assignment2}'`;
        this.msg_err = `No se encontró el fichero '${path_assignment}'`;
        const fileexists = await Utils.checkFileExists(path_assignment);
        if (!fileexists) {
            error_critical = this.msg_err;
        }
        fileexists.should.be.equal(true);
        this.msg_err = `No se encontró el fichero '${path_assignment2}'`;
        const fileexists2 = await Utils.checkFileExists(path_assignment2);
        if (!fileexists2) {
            error_critical = this.msg_err;
        }
        fileexists.should.be.equal(true);
    });

    it("2: Comprobando que el fichero principal contiene JSON con formato correcto.", async function () {
        this.score = 0.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El fichero contiene JSON con formato correcto.";
            this.msg_err = `El fichero ${path_assignment} no contiene JSON válido.`;
            const data = fs.readFileSync(path_assignment, 'utf8');
            let isJSON = Utils.isJSON(data);
            isJSON.should.be.equal(true);
            if(!isJSON){
                error_critical = `El fichero ${path_assignment} no contiene JSON válido.`;
            } else {
                banda = JSON.parse(fs.readFileSync(path_assignment, 'utf8'));
            }
        }
    });

    it("3: Comprobando que el schema contiene JSON con formato correcto.", async function () {
        this.score = 0.5;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema contiene JSON con formato correcto.";
            this.msg_err = `El fichero ${path_assignment2} no contiene JSON válido.`;
            const data = fs.readFileSync(path_assignment2, 'utf8');
            let isJSON = Utils.isJSON(data);
            isJSON.should.be.equal(true);
            if(!isJSON){
                error_critical = `El fichero ${path_assignment2} no contiene JSON válido.`;
            } else {
                bandaschema = JSON.parse(fs.readFileSync(path_assignment2, 'utf8'));
            }
        }
    });

    it("4: Comprobando que el JSON tiene los campos requeridos.", async function () {
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El fichero contiene los campos mínimos solicitados en el enunciado.";
            this.msg_err = `El fichero no contiene los campos mínimos solicitados en el enunciado.`;
            const schema = {
                type: "object",
                required: [ "group", "description", "foundation-year", "email", "members", "albums", "concerts" ]
            }
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("5: Comprobando email.", async function () {
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Email es correcto.";
            this.msg_err = `Email NO es correcto.`;
            const schema = {
                type: "object",
                required: [ "email"],
                properties: {                    
                    "email": {
                      "type": "string",
                      "format": "email"
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
            User.email.should.be.equal(banda.email);
        }
    });

    it("6: Comprobando foundation-year.", async function () {
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "Foundation-year es correcto.";
            this.msg_err = `Foundation-year NO es correcto.`;
            const schema = {
                type: "object",
                required: [ "foundation-year"],
                properties: {                    
                    "foundation-year": {
                      "type": "number",
                      "minimum": 1900,
                      "maximum": 2022
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });


    it("7: Comprobando que el array members es correcto.", async function () {
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El array members es correcto.";
            this.msg_err = `El array members NO es correcto.`;
            const schema = {
                type: "object",
                required: [ "members"],
                properties: {                    
                    "members": {
                      "type": "array",
                      "items": {
                        "type": "object"
                      },
                      "minItems": 2,
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("8: Comprobando que el array concerts es correcto.", async function () {
        this.score = 1;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El array concerts es correcto.";
            this.msg_err = `El array concerts NO es correcto.`;
            const schema = {
                type: "object",
                required: [ "concerts"],
                properties: {                    
                    "concerts": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["date", "location"],
                        "properties": {
                            "date": {
                                "type": "string",
                                "format": "date"
                            }
                        }
                      },
                      "minItems": 1,
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(banda)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("9: Comprobando el schema. Tiene la propiedad required.", async function () {
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema es tiene required.";
            this.msg_err = `El schema NO tiene required o no es correcto.`;
            const schema = {
                type: "object",
                required: [ "required"],
                properties: {                    
                    "required": {
                      "type": "array",
                      "minItems": 7,
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

    it("10: Comprobando el schema. Tiene el resto de atributos.", async function () {
        this.score = 2;
        if (error_critical) {
            this.msg_err = error_critical;
            should.not.exist(error_critical);
        } else {
            this.msg_ok = "El schema tiene el resto de atributos.";
            this.msg_err = `El schema NO tiene el resto de atributos.`;
            const schema = {
                type: "object",
                required: [ "required", "properties", "$id", "$schema", "type"],
                properties: {                    
                    "properties": {
                      "type": "object",
                      "required": [ "group", "description", "foundation-year", "email", "members", "albums", "concerts"]
                    }
            }}
            const validate = ajv.compile(schema)
            const valid = validate(bandaschema)
            if (!valid) console.log(validate.errors)
            valid.should.be.equal(true);
        }
    });

});
