describe("A date field", function() {
    var d = document.createElement("input"),
        v = fieldValidator.validate;

    d.setAttribute("type", "datetime");

    it("should only accept ISO 8601 format", function() {
        d.value = "1969-01-12 12:30:00";
        expect(v(d, false)).toEqual([{field: d, errors: [], isValid: true}]);

        d.value = "2020-12-31 00:00:00";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        d.value = "0001-01-12 23:59:59";
        expect(v(d)).toEqual([{field: d, errors: [], isValid: true}]);

        d.value = "0-01-12 00:00:00";
        expect(v(d)).toEqual([{field: d, errors: ["type"], isValid: false}]);

        d.value = "1999-01 00:00:00";
        expect(v(d)).toEqual([{field: d, errors: ["type"], isValid: false}]);

    });
});
