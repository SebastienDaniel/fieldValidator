describe("A date field", function() {
    var d = document.createElement("input"),
        v = fieldValidator.validate;

    d.setAttribute("type", "date");

    it("should only accept ISO 8601 fulldate format YYYY-mm-dd", function() {
        d.value = "1969-01-12";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        d.value = "2020-12-31";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        d.value = "0001-01-12";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        d.value = "0-01-12";
        expect(v(d)).toEqual([{field: d, errors: ["type"], isValid: false}]);

        d.value = "1999-01";
        expect(v(d)).toEqual([{field: d, errors: ["type"], isValid: false}]);
    });

    it("can be \"required\"", function() {
        d.setAttribute("required", "required");
        d.value = "";

        expect(v(d)).toEqual([{field: d, errors: ["required"], isValid: false}]);
    });

    it("should respect the \"min\" attribute", function() {
        d.setAttribute("min", "1990-01-01");

        // exactly min
        d.value = "1990-01-01";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // below min
        d.value = "1989-12-31";
        expect(v(d)).toEqual([{field: d, errors: ["min"], isValid: false}]);

        // above min
        d.value = "1990-01-02";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);
    });

    it("should respect the \"max\" attribute", function() {
        d.setAttribute("max", "2000-12-31");

        // exactly max
        d.value = "2000-12-31";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // below max
        d.value = "2000-12-30";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // above max
        d.value = "2001-01-01";
        expect(v(d)).toEqual([{field: d, errors: ["max"], isValid: false}]);
    });

    it("should respect the \"step\" attribute", function() {
        d.removeAttribute("max");
        // step validation requires a min date, otherwise step's starting point will be random
        d.setAttribute("min", "2015-07-10");
        d.setAttribute("step", "10");

        // same day
        d.value = "2015-07-10";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // exactly step (10 days)
        d.value = "2015-07-20";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // below step (9 days)
        d.value = "2015-07-19";
        expect(v(d)).toEqual([{field: d, errors: ["step"], isValid: false}]);

        // above step (11 days)
        d.value = "2015-07-21";
        expect(v(d)).toEqual([{field: d, errors: ["step"], isValid: false}]);

        // should support "any"
        d.setAttribute("step", "any");
        d.value = "2015-07-19";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);
        d.value = "2015-07-21";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);
    });
});
