
describe("A number field2", function() {
    var field2 = document.createElement("input"),
        v = fieldValidator.validate;

    field2.setAttribute("type", "number");
    field2.setAttribute("step", "any");

    document.body.appendChild(field2);

    it("should flag \"min\" errors", function() {
        field2.setAttribute("min", "6");
        field2.value = "5";
        expect(v(field2)).toEqual([{field: field2, errors: ["min"], isValid: false}]);

        field2.value = "6";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);

        field2.value = "7";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);

        field2.setAttribute("min", "0.01");
        field2.value = "0.01";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);

        field2.value = "0.005";
        expect(v(field2)).toEqual([{field: field2, errors: ["min"], isValid: false}]);

        field2.value = "1";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);
    });

    it("should flag \"max\" errors", function() {
        field2.setAttribute("max", "0.1");
        field2.value = "0.05";

        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);

        field2.value = "0.2";
        expect(v(field2)).toEqual([{field: field2, errors: ["max"], isValid: false}]);

        field2.setAttribute("max", "10");
        field2.value = "11";
        expect(v(field2)).toEqual([{field: field2, errors: ["max"], isValid: false}]);

        field2.value = "10";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);
    });

    it("should flag \"step\" errors", function() {
        field2.setAttribute("step", "2");
        field2.removeAttribute("min");
        field2.removeAttribute("max");

        field2.value = "1";
        expect(v(field2)).toEqual([{field: field2, errors: ["step"], isValid: false}]);

        field2.value = "3";
        expect(v(field2)).toEqual([{field: field2, errors: ["step"], isValid: false}]);

        field2.value = "2";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);

        field2.value = "4";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);

        field2.setAttribute("step", "0.001");

        field2.value = "0.004";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);

        field2.value = "0.5";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);

        field2.value = "0.0003";
        expect(v(field2)).toEqual([{field: field2, errors: ["step"], isValid: false}]);
    });


    it("should flag \"required\" errors", function() {
        field2.setAttribute("required", "required");

        field2.value = "";
        expect(v(field2)).toEqual([{field: field2, errors: ["required"], isValid: false}]);

        field2.value = "7";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);
    });

    it("should not flag errors for invalid numeric-type validation attributes", function() {
        field2.setAttribute("minlength", "6");
        field2.setAttribute("maxlength", "10");
        field2.setAttribute("pattern", "^[a-zA-Z]$");

        field2.value = "9";
        expect(v(field2)).toEqual([{field: field2, errors: [], isValid: true}]);
    });
});
