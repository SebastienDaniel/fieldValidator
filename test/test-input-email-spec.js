// single field tests
describe("A email field", function() {
    var field = document.createElement("input"),
        v = fieldValidator.validate;

    field.setAttribute("type", "email");

    document.body.appendChild(field);

    it("should flag \"minlength\" errors", function() {
        field.setAttribute("minlength", "16");

        // below minlength
        field.value = "me@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: ["minlength"], isValid: false}]);

        // exactly minlength
        field.value = "sebast@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        // above minlength
        field.value = "sebastien@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"maxlength\" errors", function() {
        field.setAttribute("maxlength", "30");

        // above maxlength
        field.value = "sebastien.daniel.is.a.long.email@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: ["maxlength"], isValid: false}]);

        // exactly maxlength
        field.value = "sebastien.daniel@sebastiend.ca";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        // below maxlength
        field.value = "sebastien@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"required\" errors", function() {
        field.setAttribute("required", "required");

        field.value = "";
        expect(v(field)).toEqual([{field: field, errors: ["required"], isValid: false}]);

        field.value = "sebastien@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"pattern\" errors", function() {
        field.setAttribute("pattern", "^[a-z,A,@,\.]*$");

        // invalid characters but valid email
        field.value = "123456seba@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: ["pattern"], isValid: false}]);

        field.value = "seb123as@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: ["pattern"], isValid: false}]);

        field.value = "sebas123456@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: ["pattern"], isValid: false}]);

        field.value = "sebastien@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"type\" errors when value is not an email", function() {
        field.removeAttribute("pattern");

        // illegal email character
        field.value = "seba stien@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: ["type"], isValid: false}]);

        // no @
        field.value = "sebastiendaniel.ca";
        expect(v(field)).toEqual([{field: field, errors: ["type"], isValid: false}]);

        // no TLD
        field.value = "sebastien@sebweb";
        expect(v(field)).toEqual([{field: field, errors: ["type"], isValid: false}]);
    });

    it("should not flag errors for invalid string-type validation attributes", function() {
        field.setAttribute("min", "6");
        field.setAttribute("max", "10");
        field.setAttribute("step", "3");

        field.value = "sebastien@sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });
});
