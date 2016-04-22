/**
 * Created by Vitalii on 13/04/2016.
 * jQuery TimelineCV timelineCV
 * v.0.1.1
 */
;
'use strict';
(function ($) {
    /**
     * Default configuration for TimelineCV
     * @type {{containerClass: string, ajaxConfiguration: {url: string, type: string, contentType: string, dataType: string}, errorMessage: string, errorClass: string}}
     */
    var defaultConfiguration = {
        //main container css class
        ulContainerClass: "timeline-cv",
        timeClass: 'timeline-cv-time',
        eventLineClassLeft: 'timeline-cv-eventline-left',
        eventLineClassRight: 'timeline-cv-eventline-right',
        eventDescClassLeft: 'timeline-cv-eventdesc-left',
        eventDescClassRight: 'timeline-cv-eventdesc-right',
        data: {},
        //base ajax configuration
        ajaxConfiguration: {
            url: "",
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        },
        //Error
        errorMessage: "",
        errorClass: "timeline-cv-error-message"
    };
    var mainLineElementItemObjArray = [];
    /**
     * Service functions
     */

    /**
     * Get random color
     * @returns {string}
     * @private
     */
    function _getRandomColor() {
        /*var letters = '0123456789ABCDEF'.split('');
         var color = '#';
         for (var i = 0; i < 6; i++) {
         color += letters[Math.floor(Math.random() * 16)];
         }
         return color;*/
        return '#' + Math.floor(Math.random() * 16777215).toString(16); // zapihni v peremennuyu 4islo
    }

    function _getYearMonth(startDate, type) { // ne delay 3 returna - obijavi peremennuyu i odin return
        switch (type) {
            case 'y':
                return new Date(startDate).getFullYear();
            case undefined:
                return new Date(startDate).getFullYear();
            case 'm':
                return new Date(startDate).getMonth();
        }
    };
    /**
     * Creating a global constructor for plagin object
     * @param container
     * @param configuration
     * @constructor
     */
    function TimelineCV(container, configuration) {
        var $this = this; // eto bred, 4erez $ objavlajutsya peremennije jQuery
        //override default configuration
        $this.config = $.extend(true, {}, defaultConfiguration, configuration);
        $this.container = container; // ispolzui this.$container - tak budet ponyatno 4to eto jQuery object

        /**
         * Describe default events handler
         */
        /* $this.container.on('submit', function(e){
         e.preventDefault();
         console.log('submit');

         var dataObj = {
         data: JSON.stringify( {selected:$this.container.find(':checked').val() }),
         };

         var ajaxSettings = $.extend({}, $this.config.ajaxconfiguration, dataObj);

         $.ajax(ajaxSettings).done(function(data){
         //Привет от сервера!
         }).fail(function(data){

         var retVal = $this.container.triggerHandler('responseerror.npoll', data);

         if(retVal !== false){
         $this.container.append($('<p/>',{
         text: $this.config.errorMessage,
         'class': $this.config.errorClass
         }));
         }
         });

         $this.labels = $this.container.find('label');
         $this.container.width($this.container.width()).height($this.container.height()).find('form').remove();

         $this.container.trigger('beforeresponse.npoll');

         });*/
        /* $this.container.one('change', function(e){
         $this.container.find('button').removeAttr('disabled');

         });*/

        /**
         * Describe users events handler
         */
        $.each($this.config, function (key, value) {
            if (typeof value === 'function') {
                $this.container.on(key + '.timelineCV', function (e, param) {
                    return value(e, $this.container, param);
                });
            }
        }); // .bind(this) pered ')'

        //Initialize TimelineCV
        $this.init($this.config.data);
    }

    /**
     * Initialization method
     */
    TimelineCV.prototype.init = function (data) {
        var $this = this;
        //this.container.addClass(this.config.containerClass);
        this.container.append(this.createMainLineElement(data));

        var arrColorLeft = randomColor({
            count: 100,
            hue: "blue",
            luminosity: 'dark',
            //seed:100
        });
        var arrColorRight = randomColor({
            count: data.work.length + 1,
            hue: "green",
            luminosity: 'bright',
            //seed:100
        });
        $.each(data.work, function (i, item) {
            $this.createEventLineElement(item, "left", '#000000');
        });
        $.each(data.education, function (i, item) {
            $this.createEventLineElement(item, "right", '#000000');
        });
        this.container.trigger('created.timelineCV');
    }

    /**'#6CBFEE'
     *
     */
    TimelineCV.prototype.createMainLineElement = function (data) {
        var $this = this;
        var yearArray = [];

        /**
         * Util func to collecting years to array
         * @param array
         * @param startDate
         * @param endDate
         */
        function collectYear(array, startDate, endDate) {
            if (!array.find(function (i) { // ispolzui $.fn.some()
                    if (i === _getYearMonth(startDate))
                        return true;
                })) {
                array.push(_getYearMonth(startDate));
            }
            if (!array.find(function (i) {
                    if (i === _getYearMonth(endDate))
                        return true;
                })) {
                array.push(_getYearMonth(endDate));
            }
        };
        //collect all years from work
        data.work.forEach(function (item) {
            collectYear(yearArray, item.startDate, item.endDate);
        });
        //collect all years from education
        data.education.forEach(function (item) {
            collectYear(yearArray, item.startDate, item.endDate);
        });

        yearArray.sort(function (a, b) {
            return a - b;
        });

        var lineElement = $('<ul/>').addClass(this.config.ulContainerClass);

        for (var i = 0; i < yearArray.length; i++) {
            var obj = {};
            obj.year = yearArray[i];
            var item = $('<li/>', {'id': yearArray[i]});
            var itemTime = $('<time/>', {
                'class': $this.config.timeClass,
                'datetime': yearArray[i]
            }).append($('<span/>').html(yearArray[i]));

            var h;
            if ((yearArray[i] - yearArray[i + 1]) < -1) {
                h = 170;
            } else h = 120;
            if (yearArray[i + 1] != undefined) {

                obj.betweenNext = yearArray[i + 1] - yearArray[i];
            } else {
                obj.betweenNext = 1;
            }

            var itemContent = $('<div/>').css({'height': +h + 'px'});
            item.append(itemTime).append(itemContent);
            lineElement.append(item);
            mainLineElementItemObjArray.push(obj);
        }

        return lineElement;
    };

    /**
     * Build Event line element
     * @param data
     * @param side
     */
    TimelineCV.prototype.createEventLineElement = function (data, side, color) {

        var $this = this;
        var classElementDescription = this.config.eventDescClassRight;
        var classElement = $this.config.eventLineClassRight; // ispolzui this
        var wayMargin = 5;
        switch (side) {
            case 'left':
                classElement = $this.config.eventLineClassLeft;
                wayMargin = -5;
                classElementDescription = this.config.eventDescClassLeft;
                break;
            case 'right':
                classElement = $this.config.eventLineClassRight;
                wayMargin = 5;
                classElementDescription = this.config.eventDescClassRight;
                break;
        }
        ;
        //li
        var endDateTop = $('#' + _getYearMonth(data.endDate)).position().top;
        var startDateTop = $('#' + _getYearMonth(data.startDate)).position().top;
        //div
        var topElement = ((_getYearMonth(data.startDate, 'm') + 1) * 10) + 20;
        var heightElement = (endDateTop - startDateTop) - topElement + 20;

        // var color = 'blue';
        var margin;

        mainLineElementItemObjArray.find(function (item) {
            if (item.year === _getYearMonth(data.endDate)) {
                heightElement = heightElement + ((_getYearMonth(data.endDate, 'm') + 1) * 10 / item.betweenNext);
            }
        });
        //console.log(arrColor);
        //color = _getRandomColor();
        var lineEventsCreatedArray = $('.' + classElement);
        if (lineEventsCreatedArray.length > 0) {
            $.each(lineEventsCreatedArray, function (i, item) {

                var x1 = $(item).offset().top - $this.container.children().filter('.' + $this.config.ulContainerClass).offset().top;
                var y1 = x1 + $(item).outerHeight();

                if ((startDateTop + topElement >= x1 && startDateTop + topElement < y1) || (startDateTop + topElement + heightElement >= x1 && startDateTop + topElement + heightElement < y1)) {
                    margin = parseInt($(item).css('margin-left')) + wayMargin;
                }
            })
        }
        ;

        var lineEvent = $('<div/>', {'class': classElement}).css({
            'top': topElement + 'px',
            'height': heightElement + 'px',
            'margin-left': margin + 'px',
            //'background': color
        });
        var spanStartDate = $('<span/>').css({'top':'-20px'}).html(new Date(data.startDate).toLocaleDateString());
        var spanEndDate = $('<span/>').css({'top':'108%'}).html(new Date(data.endDate).toLocaleDateString()); // a 4ego ne 109% - plohaya praktika
        lineEvent.before().append(spanStartDate).after().append(spanEndDate);

        var head, desc, date,line;
        if (side === "left") {
            date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.company);
            desc = $('<p/>').html(data.position);
        }
        else {
            date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.institution);
            desc = $('<p/>').html(data.studyType + " on " + data.area);
        }

        var descEvent = $('<div/>', {'class': classElementDescription}).css({
            'top': topElement + 'px',
            'height': 'auto',//heightElement / 2 + 'px',
            'color': '#ffffff',
            // 'background': color
        }).append('<span/>').append(date).append(head).append(desc);

        $('#' + _getYearMonth(data.startDate)).css("color", color).append(lineEvent).append(descEvent);
//debugger;
//$('.'+this.config.ulContainerClass).append(lineEvent);
    }
    ;
    /**
     * Add TimelineCV to jQuery prototype
     * @param configuration
     * @returns {*}
     */
    $.fn.timelineCV = function (configuration) {
        new TimelineCV(this.first(), configuration);
        return this.first();
    };

})
(jQuery);