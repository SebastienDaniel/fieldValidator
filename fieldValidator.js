// NECESSARY POLYFILLS
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisArg*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

fieldValidator = (function() {
    var attributesToValidate = ['maxlength', 'minlength', 'max', 'min', 'type', 'required', 'step'],
        elementsToValidate = ['INPUT','SELECT','TEXTAREA'],
        passed = 'passed-validation', // CSS class to append to elements that PASS validation
        failed = 'failed-validation'; // CSS class to append to elements that FAIL validation
    
        
    function validator(el, attribute) {
        var atValue = el.getAttribute(attribute),
            result,
			errorMsg = '';

        switch (attribute) {
            case 'maxlength':
                if (el.value.toString().length > parseInt(atValue)) {
                    result = false;
                    errorMsg = 'value too long, max length is ' + atValue + ' characters';
                } else {
                    result = true;
                }
                break;
                
            case 'minlength':
                if (el.value.toString().length < parseInt(atValue)) {
                    result = false;
                    errorMsg = 'value too short, minimum length is ' + atValue + ' characters';
                } else {
                    result = true;
                }
                break;
                
            case 'min':
                if (parseFloat(el.value) < parseFloat(atValue)) {
                    result = false;
                    errorMsg = 'value is below minimum value (' + atValue + ')';
                } else {
                    result = true;
                }
                break;
                
            case 'max':
                if (parseFloat(el.value) > parseFloat(atValue)) {
                    result = false;
                    errorMsg = 'value is above maxmimum value (' + atValue + ')';
                } else {
                    result = true;
                }
                break;
                
            case 'step':
                if (parseInt(el.value) % parseInt(atValue) !== 0) {
                    result = false;
                    errorMsg = 'value is not a multiple of ' + atValue;
                } else {
                    result = true;
                }
                break;
                
            case 'required':
                if (el.value === '' || el.value === 'null') {
                    result = false;
                    errorMsg = 'this field is required';
                } else {
                    result = true;
                }
                break;
                
            case 'type':
                result = true;
                break;
                
            default:
                break;
        }
        
        return {
			result: result,
			errorMsg: errorMsg,
			node: el
		};
    }
    
    // validates element (el) if it is of a type found in elementsToValidate
    // uses ats as a list of attributes to validate the element's value agains, otherwise it uses the module's attributesToValidate array
    function validateField(el, ats) {
        var result,
            ats;
        
        // set the attributes to validate against
        if (ats && Object.prototype.toString.call(ats) === '[object Array]') {
            ats = ats;
        } else {
            ats = attributesToValidate;
        }
            
        // verify that el is a valid element
        if (!elementsToValidate.some(function(a) {
                return el.tagName.toUpperCase() === a.toUpperCase();
            })) {
            throw new Error(el.tagName + ' is not a valid element');
        }
        
        // run validator for each attribute present on element AND ats
        // if a failure is found, stop and return that error
        ats.some(function(a) {
            if (!!el.getAttribute(a)) {
                result = validator(el, a);
				return !result.result;
            }
        });
        
        return result
    }
    
    function validateAll(html, names, ats) {
        var result = true,
            els = [],
            names,
            o = [];
        
        // set the element types to send to validator
        if (names && Object.prototype.toString.call(names) === '[object Array]') {
            names = names;
        } else {
            names = elementsToValidate;
        }
        
        // set the attributes to validate against
        if (ats && Object.prototype.toString.call(ats) === '[object Array]') {
            ats = ats;
        } else {
            ats = attributesToValidate;
        }
        
        // build the array of elements to validate
        names.forEach(function(n) {
            Array.prototype.slice.call(html.getElementsByTagName(n)).forEach(function(v) {
                els.push(v);
            });
        });
        
        els.forEach(function(el) {
            o.push(validateField(el, ats));
        });
        
        return o;
    }

    // revealing public API
    return {
        validateField: validateField,
        validateAll: validateAll
    };
}());