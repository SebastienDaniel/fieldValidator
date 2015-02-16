
/* HTML form field validator
 * creates no dependencies and makes no assumptions
 * validates based on HTML5 field attributes
 * if no attributes are set, no validation is done
 *
 * Returns an array of objects containing a reference to the field
 * element being validated and its errors (based on attribute-name)
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

            // manage special case for checkboxes and radios
            if (el.type.toLowerCase() === "checkbox" || el.type.toLowerCase() === "radio") {
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
                    //"integer": /^[-+]?\d+$/,
                    "url": "",
		    "time": /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/, // HH:MM:SS
                    "color": /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/ // #FFF #FFFFFF
                };

            return el.value.match(patterns[type]);
        },
        maxlength: function testMaxlength(el) {
            var atValue = el.getAttribute("maxlength"),
                r = true;

            if (el.value.toString().length > parseInt(atValue, 10)) {
                r = false;
            }

            return r;
        },
        minlength: function testMinlength(el) {
            var atValue = el.getAttribute("minlength"),
                r = true;

            if (el.value.toString().length < parseInt(atValue, 10)) {
                r = false;
            }

            return r;
        },
        max: function testMax(el) {
            var atValue = el.getAttribute("max"),
                result;

            if (parseFloat(el.value) > parseFloat(atValue)) {
                result = false;
            } else {
                result = true;
            }

            return result;
        },
        min: function testMin(el) {
            var atValue = el.getAttribute("min"),
                r = true;

            if (parseFloat(el.value) < parseFloat(atValue)) {
                r = false;
            }

            return r;
        },
        step: function testStep(el) {
            var atValue = el.getAttribute("step"),
                r;

            if (parseInt(el.value, 10) % parseInt(atValue, 10) !== 0) {
                r = false;
            } else {
                r = true;
            }

            return r;
        },
        pattern: function testPattern(el) {
            var atValue = el.getAttribute("pattern");

            return el.value.match(atValue);
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
            var result = true;

            // filter unrequired fields that dont have a value
            if (el.required === false && el.value === "") {
                result = false;
            }

            // filter out buttons
            if (el.type.toLowerCase() === "button") {
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

            return;
        }, f);

        // return the validation object
        return o;
    }

    /**
     *  requires an HTML object reference
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
            results.push(validateField(els[i]));
        }

        // return results array
        return results;
    }

    // revealing public API
    return {
        validate: validate
    };
}());
