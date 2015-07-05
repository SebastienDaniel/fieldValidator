/**
 * @namespace fieldValidator
 */
var fieldValidator = (function() {
    "use strict";

    // return an array of textareas
    function getTextareas(source) {
        if (source.tagName.toLowerCase() === "textarea") {
            return [source];
        } else {
            return Array.prototype.slice.call(source.getElementsByTagName("textarea"));
        }
    }

    // return an array of selects
    function getSelects(source) {
        if (source.tagName.toLowerCase() === "select") {
            return [source];
        } else {
            return Array.prototype.slice.call(source.getElementsByTagName("select"));
        }
    }

    // return an array of non checkbox or radio inputs.
    function getInputs(source) {
        if (source.tagName.toLowerCase() === "input" &&
            source.getAttribute("type").toLowerCase() !== "radio" &&
            source.getAttribute("type").toLowerCase() !== "checkbox") {
            return [source];
        } else {
            return Array.prototype.slice.call(source.getElementsByTagName("input")).filter(function(i) {
                return i.getAttribute("type").toLowerCase() !== "checkbox" && i.getAttribute("type").toLowerCase() !== "radio";
            });
        }
    }

    // return an object of checkbox arrays, separated by the "name" property
    function getCheckboxes(source) {
        var o = {};
        if (source.tagName.toLowerCase() === "input" && source.getAttribute("type").toLowerCase() === "checkbox") {
            o[source.getAttribute("name").toLowerCase()] = [source];
        } else {
            Array.prototype.slice.call(source.getElementsByTagName("input")).filter(function(i) {
                return i.getAttribute("type").toLowerCase() === "checkbox";
            }).forEach(function(c) {
                var n = c.getAttribute("name").toLowerCase();

                if (o[n]) {
                    o[n].push(c);
                } else {
                    o[n] = [c];
                }
            });
        }

        return o;
    }

    // return an object of radio arrays, separated by the "name" property
    function getRadios(source) {
        var o = {};
        if (source.tagName.toLowerCase() === "input" && source.getAttribute("type").toLowerCase() === "radio") {
            o[source.getAttribute("name").toLowerCase()] = [source];
        } else {
            Array.prototype.slice.call(source.getElementsByTagName("input")).filter(function(i) {
                return i.getAttribute("type").toLowerCase() === "radio";
            }).forEach(function(c) {
                var n = c.getAttribute("name").toLowerCase();

                if (o[n]) {
                    o[n].push(c);
                } else {
                    o[n] = [c];
                }
            });
        }

        return o;
    }

    /**
     * @memberof fieldValidator
     * @private
     *
     * @summary scans through the provided HTML object an retrieves all supportedElements
     * @param html {Object} HTML element to scan (if it is a supportedElement, it will be the only element scanned)
     * @returns {Object} Object of arrays of all supportedElements extracted from html
     */
    function getFields(html) {
        var fields = {};

        fields.selects = getSelects(html);
        fields.textareas = getTextareas(html);
        fields.inputs = removeUnwantedFields(getInputs(html));
        fields.checkboxes = getCheckboxes(html);
        fields.radios = getRadios(html);

        return fields;
    }

    /**
     * @memberof fieldValidator
     * @private
     *
     * @summary removes all "button" types, since they do not capture user input (data)
     * @param a {Array} the array of elements to clean
     * @returns {Array} new Array, without the rejected button "types"
     */
    function removeUnwantedFields(a) {
        var buttons = ["submit", "reset", "file", "button"],
            i,
            j,
            aL = a.length,
            rL = buttons.length,
            type,
            f,
            b = [];

        for (i = 0; i < aL; i++) {
            j = 0;
            f = false;
            type = a[i].getAttribute("type").toLowerCase();

            // check if element Type is to be rejected
            while (!f && j < rL) {
                if (type === buttons[j]) {
                    f = true;
                }
                j++;
            }

            // if not rejected, add to new array
            if (!f) {
                b.push(a[i]);
            }
        }

        return b;
    }

    function validateType(el) {
        var typePatterns = {
                "email": /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                "date": /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/, // YYYY-MM-DD
                "datetime": /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
                "number": /^[-+]?\d*(?:[\.\,]\d+)?$/,
                "url": /^(https?|ftp|file|ssh):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%\/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)?/,
                "time": /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/, // HH:MM:SS
                "color": /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ // #FFF #FFFFFF
            },
            type = el.getAttribute("type").toLowerCase(),
            result = true;

        if (el.validity) {
            result = !el.validity.badInput && !el.validity.typeMismatch;
        } else if (typePatterns[type]) {
            result = typePatterns[type].test(el.value);
        }

        return result;
    }

    function validateAbstractStringType(el) {
        var attributes = {
                maxlength: function testMaxlength(el) {
                    return el.value.toString().length <= parseInt(el.getAttribute("maxlength"), 10);
                },
                minlength: function testMinlength(el) {
                    if (el.value.length > 0) {
                        return el.value.toString().length >= parseInt(el.getAttribute("minlength"), 10);
                    } else {
                        return true;
                    }
                },
                pattern: function testPattern(el) {
                    return new RegExp(el.getAttribute("pattern"), "g").test(el.value);
                },
                required: function testRequired(el) {
                    return el.value.length > 0;
                }
            },
            keys = Object.keys(attributes),
            kL = keys.length,
            o = {
                field: el,
                errors: [],
                isValid: true
            },
            i;

        for (i = 0; i < kL; i++) {
            if (el.getAttribute(keys[i])) {
                if (!attributes[keys[i]](el)) {
                    o.isValid = false;
                    o.errors.push(keys[i]);
                }
            }
        }

        return o;
    }

    function validateAbstractNumericType(el) {
        var attributes = {
                max: function testMax(el) {
                    return parseFloat(el.value) <= parseFloat(el.getAttribute("max"));
                },
                min: function testMin(el) {
                    return parseFloat(el.value) >= parseFloat(el.getAttribute("min"));
                },
                step: function testStep(el) {
                    var step = el.getAttribute("step"),
                        decimals = step.split(".").pop().length;

                    return (el.value * Math.pow(10, decimals)) % (step * Math.pow(10, decimals)) === 0;
                },
                required: function testRequired(el) {
                    return el.value.length > 0;
                }
            },
            keys = Object.keys(attributes),
            kL = keys.length,
            o = {
                field: el,
                errors: [],
                isValid: true
            },
            i;

        if (el.validity) {
            if (el.validity.rangeOverflow) {
                o.isValid = false;
                o.errors.push("max");
            }

            if (el.validity.rangeUnderflow) {
                o.isValid = false;
                o.errors.push("min");
            }

            if (el.validity.stepMismatch) {
                o.isValid = false;
                o.errors.push("step");
            }

            if (el.validity.valueMissing) {
                o.isValid = false;
                o.errors.push("required");
            }
        } else {
            for (i = 0; i < kL; i++) {
                if (el.getAttribute(keys[i])) {
                    if (!attributes[keys[i]](el)) {
                        o.isValid = false;
                        o.errors.push(keys[i]);
                    }
                }
            }
        }

        return o;
    }

    function validateAbstractTimeType(el) {
        var o = {
            field: el,
            errors: [],
            isValid: true
        };

        return o;
    }

    function validateSelect(el) {
        var o = {
            field: el,
            errors: [],
            isValid: true
        };

        // if required flag all "emptyish" values
        if (el.required) {
            if (el.value === "" || el.value === null || el.value === "null" || el.value === undefined) {
                o.errors = ["required"];
                o.isValid = false;
            }
        }
        return o;
    }

    function validateCheckboxes(checkboxes) {
        var isRequired = false,
            isChecked = false,
            cL = checkboxes.length,
            validations = [],
            i = 0;

        // is at least one checkbox required in the group
        while (i < cL) {
            if (checkboxes[i].required) {
                isRequired = true;
                i = cL;
            }
            i++
        }

        // is at least one checkbox checked in the group
        i = 0;
        while (i < cL) {
            if (checkboxes[i].checked) {
                isChecked = true;
                i = cL;
            }
            i++
        }

        return {
            field: checkboxes,
            errors: isRequired && !isChecked ? ["required"] : [],
            isValid: isRequired ? isChecked : true
        };
    }

    function validateRadios(radios) {
        var isRequired = false,
            isChecked = false,
            rL = radios.length,
            validations = [],
            i = 0;

        // is at least one radio required in the group
        while (i < rL) {
            if (radios[i].required) {
                isRequired = true;
                i = rL;
            }
            i++
        }

        // is at least one radio checked in the group
        i = 0;
        while (i < rL) {
            if (radios[i].checked) {
                isChecked = true;
                i = rL;
            }
            i++
        }

        return {
            field: radios,
            errors: isRequired && !isChecked ? ["required"] : [],
            isValid: isRequired ? isChecked : true
        };
    }

    return {
        validate: function(html) {
            // get the fields object
            var f = getFields(html),
                r = [];

            // validate inputs
            f.inputs.forEach(function(i) {
                var type = i.getAttribute("type").toLowerCase();

                if (type === "text" || type === "email" || type === "url" || type === "tel") {
                    r.push(validateAbstractStringType(i));
                } else if (type === "number") {
                    r.push(validateAbstractNumericType(i));
                } else if (type === "date" || type === "datetime" || type === "time" || type === "week" || type === "month") {
                    r.push(validateAbstractTimeType(i));
                    console.log("date & time type validations aren't implemented yet");
                }
            });

            // validate the "type" attribute of all input fields
            r.forEach(function(report) {
                if (!validateType(report.field)) {
                    report.errors.push("type");
                    report.isValid = false;
                }
            });

            // validate textareas
            f.textareas.forEach(function(t) {
                r.push(validateAbstractStringType(t));
            });

            // validate selects
            f.selects.forEach(function(s) {
                r.push(validateSelect(s));
            });

            // validate checkboxes
            Object.keys(f.checkboxes).forEach(function(key) {
                r.push(validateCheckboxes(f.checkboxes[key]))
            });

            // validate radios
            Object.keys(f.radios).forEach(function(key) {
                r.push(validateRadios(f.radios[key]))
            });

            return r;
        }
    };
}());
