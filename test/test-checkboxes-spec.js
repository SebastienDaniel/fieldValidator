describe("checkboxes", function() {
    var group1 = [],
        group2 = [],
        container = document.createElement("div"),
        group1Container = document.createElement("div"),
        group2Container = document.createElement("div"),
        v = fieldValidator.validate;

    // clear document
    document.body.innerHTML = "";

    // inject a group of checkboxes
    for (var i = 0; i < 3; i++) {
        var c = document.createElement("input");

        c.setAttribute("type", "checkbox");
        c.setAttribute("name", "group1");
        c.setAttribute("value", "index" + i);
        group1Container.appendChild(c);
        group1.push(c);
    }

    container.appendChild(group1Container);
    container.appendChild(group2Container);
    document.body.appendChild(container);

    it("should be validated as a group", function() {
        expect(v(group1Container)).toEqual([{
            field: group1,
            errors: [],
            isValid: true
        }]);
    });

    it("should return only 1 validation object per name group", function() {
        // inject a second group
        // inject a group of checkboxes
        for (var i = 0; i < 3; i++) {
            var d = document.createElement("input");

            d.setAttribute("type", "checkbox");
            d.setAttribute("name", "group2");
            d.setAttribute("value", "index" + i);
            group2Container.appendChild(d);
            group2.push(d);
        }

        expect(v(container)).toEqual([
            {
                field: group1,
                errors: [],
                isValid: true
            },
            {
                field: group2,
                errors: [],
                isValid: true
            }
        ]);
    });

    it("should flag \"required\" errors once per name group", function() {
        // inject required on group1[0]
        group1[0].setAttribute("required", "required");
        expect(v(container)).toEqual([
            {
                field: group1,
                errors: ["required"],
                isValid: false
            },
            {
                field: group2,
                errors: [],
                isValid: true
            }
        ]);

        // inject required on group1[1]
        group1[1].setAttribute("required", "required");
        expect(v(container)).toEqual([
            {
                field: group1,
                errors: ["required"],
                isValid: false
            },
            {
                field: group2,
                errors: [],
                isValid: true
            }
        ]);

        // check a box in group1
        group1[0].setAttribute("checked", "checked");
        expect(v(container)).toEqual([
            {
                field: group1,
                errors: [],
                isValid: true
            },
            {
                field: group2,
                errors: [],
                isValid: true
            }
        ]);
    });
});
