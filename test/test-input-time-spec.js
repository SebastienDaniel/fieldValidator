describe("time fields ", function() {
    var time = document.createElement("input"),
        v = fieldValidator.validate;

        time.setAttribute("type", "time");

    it("should flag \"min\" errors, based on a partial-time format", function() {
        time.setAttribute("min", "12:00:00");

        // exactly min
        time.value = "12:00:00";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);

        // below min
        time.value = "11:00:00";
        expect(v(time)).toEqual([{field: time, errors: ["min"], isValid: false}]);

        // above min
        time.value = "12:00:01";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);

        // above min in milliseconds
        time.value = "12:00:00.001";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);
    });

    it("should flag \"max\" errors, based on a partial-time format", function() {
        time.setAttribute("max", "22:00:00");

        // exactly max
        time.value = "22:00:00";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);

        // below max
        time.value = "20:00:00";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);

        // above max
        time.value = "23:00:00";
        expect(v(time)).toEqual([{field: time, errors: ["max"], isValid: false}]);

        // above max in milliseconds
        time.value = "22:00:00.001";
        expect(v(time)).toEqual([{field: time, errors: ["max"], isValid: false}]);
    });

    it("should flag \"step\" errors, based on nbr of seconds", function() {
        time.setAttribute("step", "3600");

        // exactly min and step
        time.value = "12:00:00";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);

        // above min and equal to step
        time.value = "13:00:00";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);

        // above min, and below step
        time.value = "12:30:00";
        expect(v(time)).toEqual([{field: time, errors: ["step"], isValid: false}]);

        // above min, and above step
        time.value = "13:10:00";
        expect(v(time)).toEqual([{field: time, errors: ["step"], isValid: false}]);

        // remove all tested attributes
        time.removeAttribute("min");
        time.removeAttribute("step");
        time.removeAttribute("max");
    });

    it("should flag \"required\"", function() {
        time.setAttribute("required", "required");

        // has data
        time.value = "12:00:00";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);

        // has no data
        time.value = "";
        expect(v(time)).toEqual([{field: time, errors: ["required"], isValid: false}]);
    });

    it("should flag \"type\" issues", function() {
        // string data
        time.value = "hello";
        expect(v(time)).toEqual([{field: time, errors: ["type"], isValid: false}]);

        // numeric data
        time.value = "12345";
        expect(v(time)).toEqual([{field: time, errors: ["type"], isValid: false}]);

        // date data
        time.value = "2015-09-03";
        expect(v(time)).toEqual([{field: time, errors: ["type"], isValid: false}]);

        // incomplete time
        time.value = "23";
        expect(v(time)).toEqual([{field: time, errors: ["type"], isValid: false}]);

        // semi complete time
        time.value = "12:25";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);

        // milliseconds
        time.value = "12:35:20.005";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);

        // beyond milliseconds
        time.value = "12:35:20.00005";
        expect(v(time)).toEqual([{field: time, errors: [], isValid: true}]);
    });
});
