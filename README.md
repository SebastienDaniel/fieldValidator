fieldValidator
==============

Uses HTML and HTML5 form element attributes (*min, max, maxlength, type, step, etc.*) to validate user input.

## Getting started
This plugin is made to be used within the browser. Start by installing the module in your project's directory:

```shell
npm install fieldvalidator
```

If you use [Browserify](http://browserify.org/) you can then require it within your code:

```js
var validate = require("fieldvalidator").validate;
```

Otherwise, just link to the `fieldValidator.min.js` script from `node_modules/fieldvalidator/`

## How it works
The `validate()` function expects one argument: an HTML object.

From that object it will grab all form fields (*input, textarea, select*) and validate them based on their HTML5 form attributes:

- min
- max
- minlength (*technically not in the HTML5 spec, but we found it common enough to add it*)
- maxlength
- pattern
- required
- step
- type (*doesn't currently validate datetime and time types*)

It will return an array of validation objects, each object has 3 properties:

- **field**: a reference to the HTML field that was validated. This will be an array of fields in the case of checkboxes & radios.
- **errors**: an array of error strings to signify what caused the error (*it will return the name of the faulty attribute's name*)
- **isValid**: boolean, representing whether the field passed validation or not.

If the browser has the "validity" object for fields, the module will use the values available there instead of making
it's own validations (*except for minlength validation*).

You are then free to handle these errors as you see fit.

### A simple example

#### The HTML
```html
<div id="my-form">
    <label for="fullname">What is your name?</label>
    <input type="text" name="fullname" required="required" />
    
    <label for="color">What is your favorite color?</label>
    <select name="color" required="required">
        <option value=""></option>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
    </select>
    
    <label for="email">What is your email address?</label>
    <input type="email" name="email" />
    
    <input type="button" id="form-button" value="send" />
</div>
```

#### The JavaScript
```js
(function() {
    var validate = require("fieldvalidator").validate;
    document.getElementById("form-button").addEventListener("click", function(e) {
        validate(document.getElementById("my-form")).some(function(v) {
            if (v.isValid === false) {
                e.preventDefault();
                alert("Please fill out the form properly");
            }
        });
    }, true);
}());
```

#### Possible results:
#### Perfect use-case (*no errors*)
```js
[
    {
        field: "reference to fullname field",
        errors: [],
        isValid: true
    },
    {
        field: "reference to the color field",
        errors: [],
        isValid: true
    },
    {
        field: "reference to the email field",
        errors: [],
        isValid: true
    }
]   
```

### User forgot to fill out the "fullname" field and entered an invalid email in the "email" field
```js
[
    {
        field: "reference to fullname field",
        errors: ["required"],
        isValid: false
    },
    {
        field: "reference to the color field",
        errors: [],
        isValid: true
    },
    {
        field: "reference to the email field",
        errors: ["type"],
        isValid: false
    }
]   
```

## Change log
- **2015-07-11** (v1.1.2) - improved code documentation (see github repo). Reduced some unnecessary looping.
- **2015-07-10** (v1.1.1) - re-added the module.exports or window exposing feature
- **2015-07-10** (v1.1.0) - added support for `type="date"` and `type="month"` The date format must always be YYYY-mm-dd.
- **2015-07-09** (v1.0.6) - first publication on NPM, few minor adjustments to package.
