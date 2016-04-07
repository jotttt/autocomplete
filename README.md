# Autocomplete #

A autocomplete/typeahead JavaScript ajax widget

The widget allows the developer to pass in a URL that provides a JSON response with the keywords that are then filtered by the user input.
Example JSON response:
```json
[{"id":"1","value":"Jack"},{"id":"2","value":"John"}]
```
## Required Files ##
* autocomplete.js
* autocomplete.css
* jquery.js

### HTML Structure ###
```html
    <input id="company_name" type="text" class="form-control autocomplete">
    <input id="person_name" type="text" class="form-control autocomplete">
```
### Initializing ###
Here is a setup example:
```javascript
$('#company_name').autocomplete({
    url: 'company.php',
    onSelect: function (element) {
        console.debug(element);
    }
});

$('#person_name').autocomplete({
    url: 'person.php',
    minLength: 1,
    property: 'value',
    onSelect: function (element) {
        console.debug(element);
    }
});
```

## Options ##
* url: source URL to check user input against, should return a JSON array of objects
* minLength: min length of a input string to fire ajax request
* property: the property name that should be displayed within the list
* onSelect: a callback function to be called when the user clicks or hits enter on an item, the onSelect method is passed the data object corresponding to the item

