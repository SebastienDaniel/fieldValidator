// single field tests
describe("A select field", function() {
    var field = document.createElement("select"),
        options = ["", "null", "sebastien"],
        v = fieldValidator.validate;

    // make first option have no value
    field.appendChild(document.createElement("option"));
    options.forEach(function(o) {
        var opt = document.createElement("option");

        opt.value = o;
        opt.innerHTML = o;
        field.appendChild(opt);
    });
    // we now expect to have a select with 4 options
    // [0] = no value
    // [1] = ""
    // [2] = "null"
    // [3] = "sebastien"

    document.body.appendChild(field);

    it("should flag \"required\" errors", function() {
        field.setAttribute("required", "required");

        field.value = "";
        expect(v(field)).toEqual([{field: field, errors: ["required"], isValid: false}]);

        field.value = "sebastien";
        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });

    it("should flag \"emptyish\" values as \"required\" errors", function() {

        // no value
        field.children[0].setAttribute("selected", "selected");
        expect(v(field)).toEqual([{field: field, errors: ["required"], isValid: false}]);
        field.children[0].removeAttribute("selected");

        // empty string
        field.children[1].setAttribute("selected", "selected");
        expect(v(field)).toEqual([{field: field, errors: ["required"], isValid: false}]);
        field.children[1].removeAttribute("selected");

        // "null" string
        field.children[2].setAttribute("selected", "selected");
        expect(v(field)).toEqual([{field: field, errors: ["required"], isValid: false}]);
        field.children[2].removeAttribute("selected");
    });

    it("should not flag errors for invalid validation attributes (i.e. anything other than \"required\")", function() {
        field.setAttribute("min", "6");
        field.setAttribute("max", "10");
        field.setAttribute("step", "3");
        field.setAttribute("minlength", "3");
        field.setAttribute("maxlength", "3");
        field.setAttribute("pattern", "^[0-9]$");

        expect(v(field)).toEqual([{field: field, errors: [], isValid: true}]);
    });
});
