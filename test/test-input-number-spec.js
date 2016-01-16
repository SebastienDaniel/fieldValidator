
describe("A number field", function() {
    var field = document.createElement("input"),
        v = fieldValidator.validate;

    field.setAttribute("type", "number");
    field.setAttribute("step", "any");

    document.body.appendChild(field);

    it("should flag \"min\" errors", function() {
        field.setAttribute("min", "6");
        field.value = "5";
        expect(v(field)).toEqual([{field: field, errors: ["min"], isValid: false}]);

        field.value = "6";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "7";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.setAttribute("min", "0.01");
        field.value = "0.01";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.setAttribute("min", "0.000");
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.setAttribute("min", "0.01");
        field.value = "0.005";
        expect(v(field)).toEqual([{field: field, errors: ["min"], isValid: false}]);

        field.value = "1";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"max\" errors", function() {
        field.setAttribute("max", "0.1");
        field.value = "0.05";

        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "0.2";
        expect(v(field)).toEqual([{field: field, errors: ["max"], isValid: false}]);

        field.setAttribute("max", "10");
        field.value = "11";
        expect(v(field)).toEqual([{field: field, errors: ["max"], isValid: false}]);

        field.value = "10";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"step\" errors", function() {
        field.setAttribute("step", "2");
        field.removeAttribute("min");
        field.removeAttribute("max");

        field.value = "1";
        expect(v(field)).toEqual([{field: field, errors: ["step"], isValid: false}]);

        field.value = "3";
        expect(v(field)).toEqual([{field: field, errors: ["step"], isValid: false}]);

        field.value = "2";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "4";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.setAttribute("step", "0.001");

        field.value = "0.004";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "0.5";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "0.0003";
        expect(v(field)).toEqual([{field: field, errors: ["step"], isValid: false}]);

        // should accept step "any"
        field.setAttribute("step", "any");
        field.value = "0.004";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "0.5";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "0.0003";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "1";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "3";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "2";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "4";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

    });


    it("should flag \"required\" errors", function() {
        field.setAttribute("required", "required");

        field.value = "";
        expect(v(field)).toEqual([{field: field, errors: ["required"], isValid: false}]);

        field.value = "7";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should not flag errors for invalid numeric-type validation attributes", function() {
        field.setAttribute("minlength", "6");
        field.setAttribute("maxlength", "10");
        field.setAttribute("pattern", "^[a-zA-Z]$");

        field.value = "9";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should not flag errors on empty number field with step value other than 'any' and a min value of 0", function() {
        var f = document.createElement("input");

        f.setAttribute("type", "number");
        f.setAttribute("step", "1");

        document.body.appendChild(field);

        expect(v(f)).toEqual([{field: f, errors: [], isValid: true}]);
        f.setAttribute("min", "0");
        expect(v(f)).toEqual([{field: f, errors: [], isValid: true}]);
    });
});
