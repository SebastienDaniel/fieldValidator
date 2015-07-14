describe("A month field", function() {
    var d = document.createElement("input"),
        v = fieldValidator.validate;

    d.setAttribute("type", "month");

    it("should only accept format YYYY-mm", function() {
        d.value = "1969-01";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        d.value = "2020-12";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        d.value = "0001-01";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        d.value = "0-01";
        expect(v(d)).toEqual([{field: d, errors: ["type"], isValid: false}]);

        d.value = "1999";
        expect(v(d)).toEqual([{field: d, errors: ["type"], isValid: false}]);
    });

    it("can be \"required\"", function() {
        d.setAttribute("required", "required");
        d.value = "";

        expect(v(d)).toEqual([{field: d, errors: ["required"], isValid: false}]);
    });

    it("should respect the \"min\" attribute", function() {
        d.setAttribute("min", "1990-01");

        // exactly min
        d.value = "1990-01";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // below min
        d.value = "1989-12";
        expect(v(d)).toEqual([{field: d, errors: ["min"], isValid: false}]);

        // above min
        d.value = "1990-02";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);
    });

    it("should respect the \"max\" attribute", function() {
        d.setAttribute("max", "2000-12");

        // exactly max
        d.value = "2000-12";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // below max
        d.value = "2000-11";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // above max
        d.value = "2001-01";
        expect(v(d)).toEqual([{field: d, errors: ["max"], isValid: false}]);
    });


    it("should respect the \"step\" attribute", function() {
        d.removeAttribute("max");
        // step validation requires a min date, otherwise step's starting point will be random
        d.setAttribute("min", "2015-07");
        d.setAttribute("step", "3");

        // same day
        d.value = "2015-07";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // exactly step (3 months)
        d.value = "2015-10";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // below step (2 months)
        d.value = "2015-09";
        expect(v(d)).toEqual([{field: d, errors: ["step"], isValid: false}]);

        // above step (4 months)
        d.value = "2015-11";
        expect(v(d)).toEqual([{field: d, errors: ["step"], isValid: false}]);

        // should accept "any"
        d.setAttribute("step", "any");
        d.value = "2015-09";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        // above step (4 months)
        d.value = "2015-11";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);
    });

});
