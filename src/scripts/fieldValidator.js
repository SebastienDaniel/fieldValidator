
/**
 * HTML form field validator
 *
 * Creates no dependencies and makes no assumptions
 * validates based on HTML5 field attributes
 * if no attributes are set, no validation is done
 *
 * Returns an array of objects containing a reference to the field
 * element being validated and its errors (based on attribute-name)
 *
 * @namespace fieldValidator
 */
var fieldValidator = (function() {
    "use strict";
    /**
     *  attribute-name and validating function pairing
     *  order is important
     */
    var attributes = {
        required: function testRequired(el) {
            var r = true;

            // manage special case for checkboxes
            if (el.type.toLowerCase() === "checkbox") {
                if (el.checked !== true) {
                    r = false;
                }
            } else if (el.value === "" || el.value === "null") {
                r = false;
            }

            return r;
        },
        type: function testType(el) {
            var type = el.getAttribute("type").toLowerCase(),
                patterns = {
                    "email": /^[a-zA-Z0-9.!#$%&"*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
                    "date": /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/, // YYYY-MM-DD
                    "datetime": /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
                    "number": /^[-+]?\d*(?:[\.\,]\d+)?$/,
                    "integer": /^[-+]?\d+$/,
                    "url": "",
                    "text": "",
                    "checkbox": "",
                    "radio": "",
                    "time": /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/, // HH:MM:SS
                    "color": /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ // #FFF #FFFFFF
                };

            return el.value.match(patterns[type]);
        },
        maxlength: function testMaxlength(el) {
            return el.value.toString().length < parseInt(el.getAttribute("maxlength"), 10);
        },
        minlength: function testMinlength(el) {
            return el.value.toString().length > parseInt(el.getAttribute("minlength"), 10);
        },
        max: function testMax(el) {
            return parseFloat(el.value) < parseFloat(el.getAttribute("max"));
        },
        min: function testMin(el) {
            return parseFloat(el.value) > parseFloat(el.getAttribute("min"));
        },
        step: function testStep(el) {
            return (parseInt(el.value, 10) % parseInt(el.getAttribute("step"), 10)) === 0;
        },
        pattern: function testPattern(el) {
            return el.value.match(el.getAttribute("pattern")) !== null;
        }
    },
    tagNames = [ "INPUT", "SELECT", "TEXTAREA" ];

    /**
     *  get all valid form elements from HTML parent
     *  return array of those elements
     */
    function getElements(html) {
        var els = [];

        tagNames.forEach(function(tag) {
            Array.prototype.push.apply(els, html.getElementsByTagName(tag));
        });

        return els;
    }

    /**
     *  remove fields that are
     *  not required AND have no value
     */
    function filterFalsePositives(a) {
        return a.filter(function(el) {
            var result = true,
                tempRadios;

            // filter unrequired fields that dont validate (HTML5 standards)
            if (el.required === false && el.validity.valid) {
                result = false;
            }

            // filter unrequired checkboxes
            if (el.tagName === "INPUT" && el.getAttribute("type").toLowerCase() === "checkbox") {
                if (el.required === false) {
                    result = false;
                }
            }

            // filter unrequired radios
            if (el.tagName === "INPUT" && el.getAttribute("type").toLowerCase() === "radio") {
                tempRadios = a.filter(function(r) {
                    return r.getAttribute("name") === el.getAttribute("name");
                });

                result = tempRadios.some(function(r) {
                    return r.required;
                });
            }

            // filter out buttons
            if (el.type.toLowerCase() === "button" || el.type.toLowerCase() === "submit") {
                result = false;
            }

            return result;
        });
    }

    /**
     *  pass a field"s validations for all of its validable attributes
     *  return a validation object
     */
    function validateField(f) {
        // validation object default state
        var o = {
            field: f,
            violations: [],
            isValid: true // assume validity until proven otherwise
        };

        // pass validation for each attribute on field element
        Object.keys(attributes).forEach(function(a) {
            if (this.hasAttribute(a)) {
                // validate against it"s paired function
                if (!attributes[a](this)) {
                    // if failed, add violation and set field result to false
                    o.violations.push(a);
                    o.isValid = false;
                }
            }
        }, f);

        // return the validation object
        return o;
    }

    // checks if any of the radio"s group has been checked
    function validateRadio(radio, els) {
        var o = {
                field: radio,
                violations: [],
                isValid: true // assume validity until proven otherwise
            },
            name = radio.getAttribute('name");

        els = els.filter(function(el) {
            return el.getAttribute("name") === name;
        });

        if (!els.some(function(el) {
                return el.checked;
            })) {
            o.isValid = false;
            o.violations.push("required");
        }

        return o;
    }

    /**
     * @memberof fieldValidator
     * @param {object} h must be HTML element
     * @returns {Array}
     * Array of objects for each field validated, containing:
     *
     * valid: true/false
     * errors: array
     * field: reference to HTML field
     */
    function validate(h) {
        var html = h || document.body,
            els = [],
            results = [],
            i;

        // if HTML is a field element, use it
        // otherwise get all its field-element children
        if (tagNames.some(function(tag) {
            return html.tagName === tag;
        })) {
            els.push(html);
        } else {
            // get all elements within html object
            els = filterFalsePositives(getElements(html));
        }

        // process all fields
        // compile the results array with validation objects
        for (i = 0; i < els.length; i++) {
            if (els[i].getAttribute("type") === "radio") {
                results.push(validateRadio(els[i], els.filter(function(el) {
                    return el.getAttribute("type") === "radio";
                })));
            } else {
                results.push(validateField(els[i]));
            }
        }

        // return results array
        return results;
    }

    // revealing public API
    return {
        validate: validate
    };
}());
