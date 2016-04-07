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

