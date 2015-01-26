/**
 * HTML form field validator
 * creates no dependencies and makes no assumptions
 * validates based on HTML5 field attributes
 * if not attributes are set, no validation is done
 *
 * Directly manipulates the HTML elements
 * will set a CSS class of "failed-validation" when validation fails
 * will set a CSS class of "passed-validation" when validation succeeds
 */
fieldValidator = (function() {
    var attributes = ['maxlength', 'minlength', 'max', 'min', 'type', 'required', 'step'],
        els = ['INPUT','SELECT','TEXTAREA'],
        passed = 'passed-validation',
        failed = 'failed-validation';
    
        
    /**
     * expects an HTML object
     * Will do direct manipulation of the HTML fields
     * 
     * returns true if all fields validate, false otherwise
     */
    function validate(html) {
        var result = true;
        
        // get all relevant elements
        els.forEach(function(el) {
            var fields = html.getElementsByTagName(el),
                max = fields.length,
                v,
                i;
            
            // pass each element through the validator
            for (i = 0; i < max; i++) {
                if (fields[i].value !== 'null' || fields[i].value !== '') {
                    v = fields[i].value
                }
                
                // pass validation only if field is required OR if it has a value
                if (fields[i].getAttribute('required') === 'required' || !!v) {
                    // remove existing validation classes
                    ct.removeClass(passed, fields[i]);
                    ct.removeClass(failed, fields[i]);
                    
                    // apply current validation result class
                    if(validator(fields[i])) {
                        ct.appendClass(passed, fields[i]);
                    } else {
                        ct.appendClass(failed, fields[i]);
                        result = false;
                    }
                }
            }
        });
        
        return result;
    }
    
    function validator(el) {
        // for each attribute, check if the element has that attribute
        return !attributes.some(function(at) {
            // if true, process validation
            if (el.hasAttribute(at)) {
                console.log(el.getAttribute('data-erp') + ' has attribute ' + at);
                //console.log('result = ' + check(el, at));
                
                return !check(el, at);
            }
        });
        
        function check(el, at) {
            var atValue = el.getAttribute(at),
                result;

            switch (at) {
                case 'maxlength':
                    console.log('string length = ' + el.value.toString().length);
                    console.log('maxlength = ' + parseInt(atValue));
                    if (el.value.toString().length > parseInt(atValue)) {
                        result = false;
                        console.log('failed maxlength');
                    } else {
                        result = true;
                    }
                    break;
                    
                case 'minlength':
                    if (el.value.toString().length < parseInt(atValue)) {
                        result = false;
                        console.log('failed minlength');
                    } else {
                        result = true;
                    }
                    break;
                    
                case 'min':
                    if (parseFloat(el.value) < parseFloat(atValue)) {
                        result = false;
                        console.log('failed min');
                    } else {
                        result = true;
                    }
                    break;
                    
                case 'max':
                    if (parseFloat(el.value) > parseFloat(atValue)) {
                        result = false;
                        console.log('failed max');
                    } else {
                        result = true;
                    }
                    break;
                    
                case 'step':
                    if (parseInt(el.value) % parseInt(atValue) !== 0) {
                        result = false;
                        console.log('failed step');
                    } else {
                        result = true;
                    }
                    break;
                    
                case 'required':
                    if (el.value === '' || el.value === 'null') {
                        result = false;
                        console.log('failed required');
                    } else {
                        result = true;
                    }
                    break;
                    
                case 'type':
                    var dateRegex = '/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/',
                        numberRegex = '/[^0-9]/';
            
                    result = true;
                    console.log('fieldValidator TYPE');
                    console.log(el.type);
                    // dates
                    if (atValue === 'date') {
                        el.value.replace(/\/\//g, '-');
                    }
                    
                    // numbers
                    if (atValue === 'number') {
                        console.log('number detected');
                        console.log(el.value.match(numberRegex));
                        console.log(el.value);
                        if (el.value.match(numberRegex) !== null || el.value === '') {
                            result = false;
                        } else {
                            result = true;
                        }
                    }
                    break;
                    
                default:
                    break;
            }
            
            return result;
        }
    }

    // revealing public API
    return {
        validate: validate
    };
}());