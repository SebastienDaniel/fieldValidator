// single field tests
describe("A url field", function() {
    var field = document.createElement("input"),
        v = fieldValidator.validate;

    field.setAttribute("type", "url");

    document.body.appendChild(field);
    it("should accept all valid URL types", function() {
        // FTP
        field.value = "ftp://sebweb.ca/";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        // HTTP
        field.value = "http://www.sebweb.ca/";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        // HTTPS
        field.value = "https://www.sebweb.ca/";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        // FILE
        field.value = "file://W:/materialModules";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"minlength\" errors", function() {
        field.setAttribute("minlength", "20");

        // below minlength
        field.value = "http://sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: ["minlength"], isValid: false}]);

        // exact minlength
        field.value = "http://www.sebweb.ca";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        // above minlength
        field.value = "http://www.sebweb.ca/my-blog-page/";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"maxlength\" errors", function() {
        field.setAttribute("maxlength", "30");

        // above maxlength
        field.value = "https://sebastiendaniel.ca/this-is-my-blog/its-a-long-link/";
        expect(v(field)).toEqual([{field: field, errors: ["maxlength"], isValid: false}]);

        // exact maxlength
        field.value = "https://sebastiendaniel.ca/";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        // below maxlength
        field.value = "https://sebastie.ca/";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"required\" errors", function() {
        field.setAttribute("required", "required");

        field.value = "";
        expect(v(field)).toEqual([{field: field, errors: ["required"], isValid: false}]);

        field.value = "http://www.sebast.ca/";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"pattern\" errors", function() {
        field.setAttribute("pattern", "^[\:\/\.a-z\-]*$");

        // no illegal characters
        field.value = "http://sebweb.ca/my-blog";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);

        // illegal characters
        field.value = "http://www.sebWEBb.ca";
        expect(v(field)).toEqual([{field: field, errors: ["pattern"], isValid: false}]);
    });

    it("should not flag errors for invalid string-type validation attributes", function() {
        field.setAttribute("min", "6");
        field.setAttribute("max", "10");
        field.setAttribute("step", "3");

        field.value = "http://sebweb.ca/my-blog";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });
});
