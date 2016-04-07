/*
 * JavaScript autocomplete module
 * Author: Erkki Solvak and Andres Päsoke
 * Date: April 7, 2016
 *
 * HTML Structure Example:
 *   <input type="text" placeholder="Search" />
 *
 * Options:
 *     source: source URL to check user input against, should return a JSON array of objects
 *     property: if source is returning Objects rather than strings, the property name that should be displayed within the list
 *     onSelect: a callback function to be called when the user clicks or hits enter on an item
 */
(function ($) {

    $.fn.outerHTML = function () {
        return (this[0]) ? this[0].outerHTML : '';
    };
    $.fn.autocomplete = function (options) {

        var settings = {
            minLength: 3,
            property : 'name'
        };
        // Extend options with default values
        if (options) {
            options = $.extend(true, settings, options);
        }
        else {
            $.error('Options object is required');
        }
        //Iterate over the current set of matched elements
        return this.each(function () {
            var o = options;
            //Assign current element to variable
            var obj = $(this);
            $('<div class="autocomplete_results"></div>').insertAfter(obj);
            obj.keyup(function (e) {
                var code = e.keyCode || e.which;
                var str = $(this).val();
                if (str.length >= o.minLength) {
                    var autoPickDivs = $(this).next().find('div');
                    var counter = $(this).data('counter');
                    switch (e.keyCode) {
                        case 13: // enter
                            if (typeof counter === 'undefined') {
                                counter = 0;
                            }
                            // div's data attributes
                            var data = $(autoPickDivs[counter]).data();
                            o.onSelect(data);
                            $('.autocomplete_results').html('');
                            $(this).removeData('counter');
                            break;
                        case 38: // up arrow
                            if (typeof counter === 'undefined') {
                                counter = 0;
                            } else {
                                counter--;
                                if (counter < 0) {
                                    counter = autoPickDivs.length - 1;
                                }
                            }
                            $(this).data('counter', counter);
                            $('.autocomplete_pick').removeClass('selected');
                            $(autoPickDivs[counter]).addClass('selected');
                            var value = $(autoPickDivs[counter]).data(o.property);
                            $(this).val(value);
                            break;
                        case 40: // down arrow
                            if (typeof counter === 'undefined') {
                                counter = 0;
                            } else {
                                counter++;
                                if (counter == autoPickDivs.length) {
                                    counter = 0;
                                }
                            }
                            $(this).data('counter', counter);
                            $('.autocomplete_pick').removeClass('selected');
                            $(autoPickDivs[counter]).addClass('selected');
                            var value = $(autoPickDivs[counter]).data(o.property);
                            $(this).val(value);
                            break;
                        default:
                            var this_ = this;
                            var data = {
                                value: str
                            };
                            $.ajax({
                                type: "POST",
                                url: o.url,
                                data: data,
                                dataType: 'json'
                            }).done(function (data) {
                                if (data) {
                                    var html = '';
                                    for (var d in data) {
                                        html += '<div class="autocomplete_pick" ';
                                        var elem = data[d];
                                        // copy each json property to div's data attribute
                                        for (var prop in elem) {
                                            if (elem.hasOwnProperty(prop)) {
                                                html += 'data-' + prop + '="' + elem[prop] + '" ';
                                            }
                                        }
                                        html += '" >' + data[d][o.property] + '</div>';
                                    }
                                    $(this_).next('.autocomplete_results').html(html);
                                    // this prevents blur event firing before click
                                    $(this_).next('.autocomplete_results').off();
                                    $(this_).next('.autocomplete_results').on("mousedown", ".autocomplete_pick", function (e) {
                                        e.preventDefault();
                                    }).on('click', '.autocomplete_pick', function () {
                                        var value = $(this).data(o.property);
                                        $(this).parent().prev('.autocomplete').val(value);
                                        $('.autocomplete_results').html('');
                                        // div's data attributes
                                        var data = $(this).data();
                                        o.onSelect(data);
                                    });
                                }
                            });
                            break;
                    }
                }

            });

            obj.keydown(function (e) {
                var code = e.keyCode || e.which;
                if (code == 9) { // tab key
                    var autoPickDivs = $(this).next().find('div');
                    if (autoPickDivs.length > 0) {
                        var counter = $(this).data('counter');
                        if (typeof counter === 'undefined') {
                            counter = 0;
                        }
                        var data = $(autoPickDivs[counter]).data();
                        o.onSelect(data);
                        $('.autocomplete_results').html('');
                        $(this).removeData('counter');
                    }
                }
                return true;
            });

            obj.blur(function (e) {
                var autoPickDivs = $(this).next().find('div');
                if (autoPickDivs.length > 0) {
                    $('.autocomplete_results').html('');
                    $(this).removeData('counter');
                }
            });
        });
    };
    
}(jQuery));