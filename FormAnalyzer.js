function FormAnalyzer(c) {
    var defaultConfig = {
        form_id: '',
        submit_id: 'submit',
        validate_content: true,
        validate_required: true,
        css_error_class: 'field-error',
        css_ok_class: 'field-ok'
    };
    
    // setting instance configuration with CommonTasks setConfig function
    this.config = ct.setConfig(defaultConfig,c);
    
    // flush no longer needed variables
    defaultConfig = null;
    c = null;
    
    // build an array of form field objects (id, name, type, required, min, max, minlength, maxlength, value, disabled, readonly, select)
    this.form = document.getElementById(this.config['form_id']);
    this.submitButton = document.getElementById(this.config['submit_id']);
    
    this.formElements = [];
    var that = this;
    for(i = 0, iLen = this.refElements.length; i < iLen; i++) {
        var temp = this.form.getElementsByTagName(this.refElements[i]);
        
        // onmouseout process the field, apply css class based on case
        for(x = 0, tempLen = temp.length; x < tempLen; x++) {
            temp[x].onblur = function() {
                if(this.value !== '') {
                    this.value = this.value.toLowerCase();
                    that.typeValidation(this);
                }
            };
            this.formElements.push(temp[x]);
        }
    }
}

FormAnalyzer.prototype = {
    constructor: 'FormAnalyzer',
    
    refElements: ['datalist','input','select','textarea'],
    
    refTypes: ['checkbox','date','datetime','email','hidden','month','number','password','radio','range','tel','text','time','url'],
    
    typeValidation: function(t) {
        var attributes;
        var validationResult = 'good';
        
        switch (t.type) {
            case "text":
                attributes = ['pattern', 'maxlength'];
                break;
            
            case "email":
                var attributes = ['pattern', 'maxlength', 'multiple'];
                // check for illegal characters or sequences
                // check if . - _ don't follow one another
                // check if there is more than one @
                if(t.value.match(/[^a-z,0-9,\.,\-,_,@]|@.*@|[\-,_,\.]{2,}/g)) {
                    alert('email has invalid characters');
                    validationResult = 'bad';
                    break;
                }
                
                // split at @
                if(t.value.match(/@/g)) {
                    var parts = t.value.split('@');
                } else {
                    break;
                }
                
                // check if . - _ are not at the beginning or end of either part
                if(parts[0].match(/^[\-,_,\.]|[\.,\-,_]$/g) || parts[1].match(/^[\-,_,\.]|[\.,\-,_]$/g)) {
                    validationResult = 'bad';
                    break;
                }

                // TLD check
                // check that following every . there are at least 2 valid characters (part 2)
                if(!parts[1].match(/\.[a-z]{2,}$/g)){
                    validationResult = 'bad';
                    break;
                }
                break;
            
            case "password":
                var attributes = ['maxlength'];
                // required
                // maxlength (character length)
                // pattern (must match a regex pattern) ?????? maybe
                break;
            
            case "search":
                attributes = ['pattern', 'maxlength'];
                // required
                // maxlength (character length)
                // pattern (must match a regex pattern)
                break;
                
            case "tel":
                attributes = ['pattern', 'maxlength'];
                // required
                // maxlength (character length)
                // pattern (must match a regex pattern)
                break;
            
            case "url":
                attributes = ['pattern', 'maxlength'];
                // remove http:// or https:// if present
                if(t.value.match(/^https*:\/\//g)) {
                    var parts = t.value.split("//");
                    // check for illegal characters
                    if(parts[1].match(/[^a-z,0-9,\-,\.]/g)) {
                        validationResult = 'bad';
                    }
                    // check TLD
                    if(!parts[1].match(/\.[a-z]{2,}$/g)){
                        validationResult = 'bad';
                    }
                } else {
                    // check for illegal characters
                    if (t.value.match(/[^a-z,0-9,\-,\.]/g)) {
                        validationResult = 'bad';
                    }
                    // check TLD
                    if(!t.value.match(/\.[a-z]{2,}$/g)){
                        validationResult = 'bad';
                    }
                }
                break;
            
            case "number":
                attributes = ['step', 'min', 'max'];
                // required
                // max
                // min
                // step (increment)
                break;
                
            case "range":
                attributes = ['step', 'min', 'max'];
                // required
                // max
                // min
                // step (increment)
                break;
                
            case "date":
                attributes = ['min', 'max'];
                // required
                // max
                // min
                break;
            
            case "datetime":
                attributes = ['min', 'max'];
                // required
                // max
                // min
                break;

            case "datetime-local":
                attributes = ['min', 'max'];
                // required
                // max
                // min
                break;
                
            case "time":
                attributes = ['min', 'max'];
                // required
                // max
                // min
                break;
            
            case "month":
                attributes = ['min', 'max'];
                // required
                // max
                // min
                break;
            
            case "week":
                attributes = ['min', 'max'];
                // required
                // max
                // min
                break;

            default:
                break;
        }
        if(validationResult === 'bad') {
            this.error(t);
        } else if(!attributes.every(this.attributeValidation,t)) {
            this.error(t);
        } else {
            this.good(t);
        }
    },
    
    attributeValidation: function(e, i, a) {
        var validationResult = 'good';
        var t = this;
        
        switch(e) {
            case 'maxLength':
                // required, maxlength, min, max, pattern, step
                if(t.maxLength !== -1) {
                    if(t.value.length > t.maxLength) {
                        alert('you have surpassed the character limit\n' + t.value.length + '/' + t.maxLength);
                        t.value = t.value.substr(0,t.maxLength);
                        validationResult = 'bad';
                    }
                }
                break;
            
            case 'min':
                if(parseFloat(t.value) < parseFloat(t.min)) {
                    alert('value below minimum');
                    validationResult = 'bad';
                }
                break;
                
            case 'max':
                if(parseFloat(t.value) > parseFloat(t.max)) {
                    alert('value above maximum');
                    validationResult = 'bad';
                }
                break;
            
            case 'step':    
                if((parseFloat(t.value) % parseFloat(t.step)) !== 0) {
                    alert('value not an increment of ' + t.step);
                    validationResult = 'bad';
                }
                break;
            
            case 'pattern':
                if(t.pattern !== "") {
                    if(!t.value.match(new RegExp(t.pattern))) {
                        alert('pattern mis-match');
                        validationResult = 'bad';
                    }
                }
                break;
            
            case 'required':
                if(t.required === true || 'required') {
                
                }
                break;
        }
        return (validationResult === 'good');
    },
    
    error: function(t) {
        ct.swapClass(this.config['css_ok_class'], this.config['css_error_class'], t);
    },
    
    good: function(t) {
        ct.swapClass(this.config['css_error_class'], this.config['css_ok_class'], t);
    }
    
}