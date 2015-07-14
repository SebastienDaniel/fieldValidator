/**
 * @namespace fieldValidator
 * @summary analyzes HTML field elements contents and returns an array of validation objects
 */
var fieldValidator = (function() {
    "use strict";

    /**
     * @memberof fieldValidator
     * @private
     * @summary gets all textarea elements within the source element.
     *
     * @param source {Object} - HTML object originally provided in the public validate function
     * @returns {Array} - Array of references to all textarea elements found within the source Object (or the source Object itself)
     */
    function getTextareas(source) {
        if (source.tagName.toLowerCase() === "textarea") {
            return [source];
        } else {
            return Array.prototype.slice.call(source.getElementsByTagName("textarea"));
        }
    }

    /**
     * @memberof fieldValidator
     * @private
     * @summary gets all select elements within the source element
     *
     * @param source {Object} - HTML object originally provided in the public validate function
     * @returns {Array} - Array of references to all select elements found within the source Object (or the source Object itself)
     */
    function getSelects(source) {
        if (source.tagName.toLowerCase() === "select") {
            return [source];
        } else {
            return Array.prototype.slice.call(source.getElementsByTagName("select"));
        }
    }

    /**
     * @memberof fieldValidator
     * @private
     * @summary gets all input elements within the source element that are not of type radio or checkbox
     *
     * @param source {Object} - HTML object originally provided in the public validate function
     * @returns {Array} - Array of references to all input elements found within the source Object (or the source Object itself)
     */
    function getInputs(source) {
        // return source object if it is an input (and not of type radio or checkbox)
        if (source.tagName.toLowerCase() === "input" &&
            source.getAttribute("type").toLowerCase() !== "radio" &&
            source.getAttribute("type").toLowerCase() !== "checkbox") {
            return [source];
        } else {
            // return an array of all inputs found within the source object, filter them if they are of type radio or checkbox
            return Array.prototype.slice.call(source.getElementsByTagName("input")).filter(function(i) {
                return i.getAttribute("type").toLowerCase() !== "checkbox" && i.getAttribute("type").toLowerCase() !== "radio";
            });
        }
    }

    /**
     * @memberof fieldValidator
     * @private
     * @summary gets all input (checkbox) elements within the source element
     *
     * @param source {Object} - HTML object originally provided in the public validate function
     * @returns {Object} - Object of arrays, each unique field "name" attribute creates a new array of
     * checkbox references to all input(checkbox) elements found within the source Object with the given name attribute value
     * (or the source Object itself)
     */
    function getCheckboxes(source) {
        var o = {};
        // if the source object is a checkbox, add it to the return object as name:[reference] pair
        if (source.tagName.toLowerCase() === "input" && source.getAttribute("type").toLowerCase() === "checkbox") {
            o[source.getAttribute("name").toLowerCase()] = [source];
        } else {
            // get all input fields, filter them if they are not type checkbox
            // for each checkbox found, build a "name":[field] pairing in the returned object
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

    /**
     * @memberof fieldValidator
     * @private
     * @summary gets all input (radio) elements within the source element
     *
     * @param source {Object} - HTML object originally provided in the public validate function
     * @returns {Object} - Object of arrays, each unique field "name" attribute creates a new array of
     * radio references to all input(radio) elements found within the source Object with the given name attribute value
     * (or the source Object itself)
     */
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
     * @summary scans through the provided HTML object and retrieves all field elements
     * @param html {Object} HTML element to scan for each type
     * @returns {Object} Object of arrays of all fields extracted from html
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
     * @summary removes all unwanted types (submit, reset, file, button), since they do not capture user input (data)
     * @param a {Array} the array of elements to clean
     * @returns {Array} new Array, without the rejected "types"
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

    /**
     * @memberof fieldValidator
     * @private
     * @summary validates input elements against their "type" attribute. Uses integrated valdiity object if present in browser.
     *
     * @param el {Object} - HTML input element
     * @returns {Boolean} - result of the elements type validation based on a type regex pattern
     */
    function validateType(el) {
        // patterns provided by ZURB foundation abide https://github.com/zurb/foundation/blob/master/js/foundation/foundation.abide.js
        var typePatterns = {
                "email": /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                "date": /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/, // YYYY-MM-DD
                "week": /(?:19|20)[0-9]{2}-W(?:0[1-9]|[1-4][0-9]|5[0-2])$/,
                "month": /(?:19|20)[0-9]{2}-(?:0[1-9]|1[0-2])$/,
                "datetime": /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
                "number": /^[-+]?\d*(?:[\.\,]\d+)?$/,
                "url": /^(https?|ftp|file|ssh):\/\/([-;:&=\+\$,\w]+@{1})?([-A-Za-z0-9\.]+)+:?(\d+)?((\/[-\+~%\/\.\w]+)?\??([-\+=&;%@\.\w]+)?#?([\w]+)?)?/,
                "time": /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){1,2}(\.[0-9]*)?$/, // HH:MM:SS.ddd...(n)d
                "color": /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ // #FFF #FFFFFF
            },
            type = el.getAttribute("type").toLowerCase(),
            result = true;

        // if browser has the validity object, us its properties to validate type
        if (el.validity) {
            result = !el.validity.badInput && !el.validity.typeMismatch;
        } else if (typePatterns[type]) {
            result = typePatterns[type].test(el.value);
        }

        return result;
    }

    /**
     * @memberof fieldValidator
     * @private
     * @summary makes generic validations for string-type input fields
     *
     * @param el {Object} HTML input or textarea element
     * @returns {Object} validation object
     */
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

    /**
     * @memberof fieldValidator
     * @private
     * @summary makes generic validations for numeric-type input fields
     *
     * @param el {Object} HTML input element
     * @returns {Object} validation object
     */
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
                        decimals;
                    if (step === "any") {
                        return true;
                    } else {
                        decimals = step.split(".").pop().length;
                        return (el.value * Math.pow(10, decimals)) % (step * Math.pow(10, decimals)) === 0;
                    }
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

    /**
     * @memberof fieldValidator
     * @private
     * @summary makes generic validations for date-type input fields
     *
     * @param el {Object} HTML input
     * @returns {Object} validation object
     */
    function validateAbstractDateType(el) {
        var attributes = {
                max: function testMax(el) {
                    return Date.parse(el.value) <= Date.parse(el.getAttribute("max"));
                },
                min: function testMin(el) {
                    return Date.parse(el.value) >= Date.parse(el.getAttribute("min"));
                },
                step: function testStep(el) {
                    var step = el.getAttribute("step"),
                        min = el.getAttribute("min"),
                        splitValue,
                        splitMin,
                        months;

                    if (step === "any") {
                        return true;
                    } else {
                        step = parseInt(step, 10);
                    }

                    // minimum has to be set, otherwise the starting date for step is random
                    if (el.getAttribute("min")) {
                        // step varies based on date type
                        if (el.getAttribute("type").toLowerCase() === "date") {
                            step *= (1000 * 60 * 60 * 24); //step is per day, minimum
                        } else if (el.getAttribute("type").toLowerCase() === "month"){
                            splitValue = el.value.split("-").map(function(v) {
                                return parseInt(v, 10);
                            });
                            splitMin = el.getAttribute("min").split("-").map(function(v) {
                                return parseInt(v, 10);
                            });

                            months = ((splitValue[0] - splitMin[0]) * 12) + splitValue[1] - splitMin[1];

                            return months % step === 0;
                        }
                        return (Date.parse(el.value) - Date.parse(el.getAttribute("min"))) % step === 0;
                    } else {
                        return true;
                    }
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

    function validateAbstractTimeType(el) {
        var attributes = {
                max: function testMax(el) {
                    return parseFloat(el.value.replace(":", "")) <= parseFloat(el.getAttribute("max").replace(":", ""));
                },
                min: function testMin(el) {
                    return parseFloat(el.value.replace(":", "")) >= parseFloat(el.getAttribute("min").replace(":", ""));
                },
                step: function testStep(el) {
                    var time = el.value.split(/\.:/).map(function(v) {
                            return parseInt(v, 10);
                        }),
                        step = el.getAttribute("step"),
                        timeInSeconds;

                    if (step === "any") {
                        return true;
                    } else {
                        step = parseInt(step, 10);
                        timeInSeconds = time[0] * (60 * 60) + time[1] * 60 + time[2];
                        return timeInSeconds % step;
                    }
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

    /**
     * @memberof fieldValidator
     * @private
     * @summary makes a custom required validation on a select element
     *
     * @param el {Object} HTML select element
     * @returns {Object} validation object
     */
    function validateSelect(el) {
        var o = {
            field: el,
            errors: [],
            isValid: true
        };

        // if required flag all "emptyish" values
        if (el.required) {
            if (el.value === "" || el.value === null || el.value === "null" || el.value === undefined) {
                o.errors.push("required");
                o.isValid = false;
            }
        }
        return o;
    }

    /**
     * @memberof fieldValidator
     * @private
     * @summary makes custom "required" validations for a group of checkboxes
     *
     * @param checkboxes {Object} HTML input (checkbox) element
     * @returns {Object} validation object
     */
    function validateCheckboxes(checkboxes) {
        var isRequired = false,
            isChecked = false,
            cL = checkboxes.length,
            i = 0;

        // is at least one checkbox required in the group
        while (i < cL) {
            if (checkboxes[i].required) {
                isRequired = true;
                i = cL;
            }
            i++;
        }

        // is at least one checkbox checked in the group
        if (isRequired) {
            i = 0;
            while (i < cL) {
                if (checkboxes[i].checked) {
                    isChecked = true;
                    i = cL;
                }
                i++;
            }
        }

        return {
            field: checkboxes,
            errors: isRequired && !isChecked ? ["required"] : [],
            isValid: isRequired ? isChecked : true
        };
    }

    /**
     * @memberof fieldValidator
     * @private
     * @summary makes custom required validation for input (radio) fields
     *
     * @param el {Object} HTML input (radio) element
     * @returns {Object} validation object
     */
    function validateRadios(radios) {
        var isRequired = false,
            isChecked = false,
            rL = radios.length,
            i = 0;

        // is at least one radio required in the group
        while (i < rL) {
            if (radios[i].required) {
                isRequired = true;
                i = rL;
            }
            i++;
        }

        // is at least one radio checked in the group
        if (isRequired) {
            i = 0;
            while (i < rL) {
                if (radios[i].checked) {
                    isChecked = true;
                    i = rL;
                }
                i++;
            }
        }

        return {
            field: radios,
            errors: isRequired && !isChecked ? ["required"] : [],
            isValid: isRequired ? isChecked : true
        };
    }

    function browserValidation(el) {
        var o = {
            field: el,
            errors: [],
            isValid: null
        };

        if (el.validity.rangeOverflow) {
            o.errors.push("max");
        }
        if (el.validity.rangeUnderflow) {
            o.errors.push("min");
        }
        if (el.validity.stepMismatch) {
            o.errors.push("step");
        }
        if (el.validity.valueMissing) {
            o.errors.push("required");
        }
        if (el.validity.badInput) {
            o.errors.push("type");
        }
        if (el.validity.patternMismatch) {
            o.errors.push("pattern");
        }
        if (el.validity.tooLong) {
            o.errors.push("maxlength");
        }
        if (el.validity.tooShort) {
            o.errors.push("minlength");
        }
        o.isValid = el.validity.valid;

        return o;
    }

    return {
        /**
         * @memberof fieldValidator
         * @summary will grab all field elements within the provided HTML object,
         * or analyze the HTML object itself if it is a form field
         *
         * @param html {Object} - HTML object to validate
         * @public
         * @returns {Array} of validation objects
         */
        validate: function(html, useBrowserValidation) {
            // get the fields object
            var f = getFields(html),
                r = [];

            // validate inputs
            if (f.inputs.length > 0) {
                if (useBrowserValidation) {
                    f.inputs.forEach(function(i) {
                        r.push(browserValidation(i));
                    });
                } else {
                    f.inputs.forEach(function(i) {
                        var type = i.getAttribute("type").toLowerCase();

                        if (type === "text" || type === "email" || type === "url" || type === "tel" || type === "week") {
                            r.push(validateAbstractStringType(i));
                        } else if (type === "number") {
                            r.push(validateAbstractNumericType(i));
                        } else if (type === "date" || type === "month") {
                            r.push(validateAbstractDateType(i));
                        } else if (type === "time") {
                            r.push(validateAbstractTimeType(i));
                        }
                    });

                    // validate the "type" attribute of all input fields
                    r.forEach(function(report) {
                        if (!validateType(report.field)) {
                            report.errors.push("type");
                            report.isValid = false;
                        }
                    });
                }
            }

            // validate textareas
            if (f.textareas.length > 0) {
                if (useBrowserValidation) {
                    f.textareas.forEach(function(t) {
                        r.push(browserValidation(t));
                    });
                } else {
                    f.textareas.forEach(function(t) {
                        r.push(validateAbstractStringType(t));
                    });
                }
            }

            // validate selects
            if (f.selects.length > 0) {
                if (useBrowserValidation) {
                    f.selects.forEach(function(s) {
                        r.push(browserValidation(s));
                    });
                } else {
                    f.selects.forEach(function(s) {
                        r.push(validateSelect(s));
                    });
                }
            }

            // validate checkboxes
            if (f.checkboxes) {
                Object.keys(f.checkboxes).forEach(function(key) {
                    r.push(validateCheckboxes(f.checkboxes[key]));
                });
            }

            // validate radios
            if (f.radios) {
                Object.keys(f.radios).forEach(function(key) {
                    r.push(validateRadios(f.radios[key]));
                });
            }

            return r;
        }
    };
}());

// adding commonJS exports if module.exports is part of the env. otherwise expose as a global module.
if (typeof module !== undefined && typeof module.exports !== undefined) {
    module.exports = fieldValidator;
} else {
    window.fieldValidator = fieldValidator;
}
