// single field tests
describe("A tel field (is just like a text field) it", function() {
    var field = document.createElement("input"),
        v = fieldValidator.validate;

    field.setAttribute("type", "tel");

    document.body.appendChild(field);

    it("should flag \"minlength\" errors", function() {
        field.setAttribute("minlength", "6");
        field.value = "seb";
        expect(v(field)).toEqual([{field: field, errors: ["minlength"], isValid: false}]);

        field.value = "123456";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "sebastien";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"maxlength\" errors", function() {
        field.setAttribute("maxlength", "10");
        field.value = "sebastien daniel";
        expect(v(field)).toEqual([{field: field, errors: ["maxlength"], isValid: false}]);

        field.value = "0123456789";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        field.value = "sebastien";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"required\" errors", function() {
        field.setAttribute("required", "required");

        field.value = "";
        expect(v(field)).toEqual([{field: field, errors: ["required"], isValid: false}]);

        field.value = "sebastien";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"pattern\" errors", function() {
        field.setAttribute("pattern", "^[a-z,A-Z]*$");

        field.value = "123sebas";
        expect(v(field)).toEqual([{field: field, errors: ["pattern"], isValid: false}]);

        field.value = "seb123as";
        expect(v(field)).toEqual([{field: field, errors: ["pattern"], isValid: false}]);

        field.value = "sebas123";
        expect(v(field)).toEqual([{field: field, errors: ["pattern"], isValid: false}]);

        field.value = "sebastien";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should not flag errors for invalid string-type validation attributes", function() {
        field.setAttribute("min", "6");
        field.setAttribute("max", "10");
        field.setAttribute("step", "3");

        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });
});
