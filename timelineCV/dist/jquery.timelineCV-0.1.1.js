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
        typeOfTimeline: "default",//default
        typeOfView: "vertical",//horizontal
        //main container css class
        ulContainerClass: "timeline-cv",
        timeClass: 'timeline-cv-time',
        eventLineClassLeft: 'timeline-cv-eventline-left',
        eventLineClassRight: 'timeline-cv-eventline-right',
        eventDescClassLeft: 'timeline-cv-eventdesc-left',
        eventDescClassRight: 'timeline-cv-eventdesc-right',

        eventLineClassTop: 'timeline-cv-eventline-top',
        eventLineClassBottom: 'timeline-cv-eventline-bottom',
        eventDescClassTop: 'timeline-cv-eventdesc-top',
        eventDescClassBottom: 'timeline-cv-eventdesc-bottom',
        mainLinePointPadding: 35, //25px
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
    function _getYearMonth(startDate, type) { // ne delay 3 returna - obijavi peremennuyu i odin return
        switch (type) {
            case 'y':
                return new Date(startDate).getFullYear();
            case undefined:
                return new Date(startDate).getFullYear();
            case 'm':
                return new Date(startDate).getMonth();
        }
    }

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
        switch (this.config.typeOfTimeline) {
            case "expanded":
            {
                switch (this.config.typeOfView) {
                    case "vertical":
                    {
                        $('.timeline').addClass('timeline-vertical');
                        $.each(data.work, function (i, item) {
                            $this.createEventLineElementVertical(item, "left", '#000000');
                        });
                        $.each(data.education, function (i, item) {
                            $this.createEventLineElementVertical(item, "right", '#000000');
                        });
                        break;
                    }
                    case "horizontal":
                    {
                        $('.timeline').addClass('timeline-horizontal');
                        $.each(data.work, function (i, item) {
                            $this.createEventLineElementHorizontal(item, "top", '#000000');
                        });
                        $.each(data.education, function (i, item) {
                            $this.createEventLineElementHorizontal(item, "bottom", '#000000');
                        });
                        break;
                    }
                }
                break;
            }
            case "default":
            {
                switch (this.config.typeOfView) {
                    case "vertical":
                    {
                        this.dataToArray(data,['work','education']);
                        /*$('.timeline').addClass('timeline-vertical');
                        $.each(data.work, function (i, item) {
                            $this.createDescElementVertical(item, "left", '#000000');
                        });
                        $.each(data.education, function (i, item) {
                            $this.createDescElementVertical(item, "right", '#000000');
                        });*/
                        break;
                    }
                    case "horizontal":
                    {
                        $('.timeline').addClass('timeline-horizontal');
                        $.each(data.work, function (i, item) {
                            $this.createDescElementHorizontal(item, "top", '#000000');
                        });
                        $.each(data.education, function (i, item) {
                            $this.createDescElementHorizontal(item, "bottom", '#000000');
                        });
                        break;
                    }
                }
                break;
            }
        }
        //Users event handlers implemented in callbacks as function
        this.container.trigger('created.timelineCV');
    };

    TimelineCV.prototype.dataToArray = function (data,nodeArray,sort) {
        var array=[];
        nodeArray.forEach(function (item) {
            data[item].forEach(function (obj) {
                array.push(obj);
            });
        });
        array.sort(function (a,b) {
           return _getYearMonth(a.startDate) -_getYearMonth(b.startDate);
        });
        return array;
    }


    TimelineCV.prototype.collectYear = function (array, item, type, endDate) {
        if (!array.find(function (i) {
                if (i === item.startDate)
                    return true;
            })) {
            array.push({'date': item.startDate, 'type': type});
        }
        if (endDate) {
            if (!array.find(function (i) {
                    if (i === item.endDate)
                        return true;
                })) {
                array.push({'date': item.endDate, 'type': type});
            }
        }
    }

    /**'#6CBFEE'
     *
     */
    TimelineCV.prototype.createMainLineElement = function (data) {
        var $this = this;
        var yearArray = [];
        var heightMainLine = 900;

        /**
         * Util func to collecting years to array
         * @param array
         * @param startDate
         * @param endDate
         */

        switch (this.config.typeOfTimeline) {
            case "default":
            {
                //collect all years from work
                data.work.forEach(function (item) {
                    $this.collectYear(yearArray, item, 'w', false);
                });
                //collect all years from education
                data.education.forEach(function (item) {
                    $this.collectYear(yearArray, item, 'e', false);
                });
                break;
            }
            case "expanded":
            {
                //collect all years from work
                data.work.forEach(function (item) {
                    $this.collectYear(yearArray, item, 'w', true);
                });
                //collect all years from education
                data.education.forEach(function (item) {
                    $this.collectYear(yearArray, item, 'w', true);
                });
                break;
            }
        }
        /*Sort array by year*/
        yearArray.sort(function (a, b) {
            return _getYearMonth(a.date) - _getYearMonth(b.date);
        });

        var lineElement = $('<ul/>').addClass(this.config.ulContainerClass);

        for (var i = 0; i < yearArray.length; i++) {
            var obj = {};
            var h = 120;
            obj.year = _getYearMonth(yearArray[i].date);
            obj.date = yearArray[i].date;
            data.work.find(function (i) {
                if (i.startDate === obj.date) {
                    obj.endDate = i.endDate;
                }
            });
            data.education.find(function (i) {
                if (i.startDate === obj.date) {
                    obj.endDate = i.endDate;
                }
            });

            obj.type = yearArray[i].type;
            var item = $('<li/>', {'id': obj.year});

            /*Date in blocks*/
            /* var icon = $('<span/>').html(_getYearMonth(obj.date) + '/' + (parseInt(_getYearMonth(obj.date, 'm')) + 1)
             +' '+_getYearMonth(obj.endDate) + '/' + (parseInt(_getYearMonth(obj.endDate, 'm')) + 1));*/
            var icon = $('<span/>');
            if (this.config.typeOfTimeline === 'default' && obj.type === "w") {
                icon.addClass('icon-user-tie').css({'font-size': '2em'});
            } else if (this.config.typeOfTimeline === 'default' && obj.type === "e") {
                icon.addClass('icon-library').css({'font-size': '2em'});
            } else {
                icon.html(obj.year)
            }

            var itemTime = $('<time/>', {
                'class': $this.config.timeClass,
                'datetime': obj.year
            }).css({'padding': this.config.mainLinePointPadding + 'px'}).append(icon);

            if (this.config.typeOfView === "vertical") {
                itemTime.css({'margin-left': -this.config.mainLinePointPadding - 17 + 'px'})

            }

            if ($this.config.typeOfTimeline === "expanded") {
                //debugger;
                if (yearArray[i + 1] != undefined && (_getYearMonth(yearArray[i].date) - _getYearMonth(yearArray[i + 1].date)) < -1) {
                    h = 170;
                } else h = 120;

                if (yearArray[i + 1] != undefined) {
                    obj.betweenNext = _getYearMonth(yearArray[i + 1].date) - _getYearMonth(yearArray[i].date);
                } else {
                    obj.betweenNext = 1;
                }
                heightMainLine = heightMainLine + h + yearArray.length * 2;
            }
            heightMainLine = heightMainLine + h - yearArray.length * 10;
            var itemContent;
            if (this.config.typeOfView === "horizontal") {
                lineElement.addClass('horizontal-line');
                itemTime.css({'margin-right': h + 'px'});
            } else if (this.config.typeOfView === "vertical") {
                lineElement.addClass('vertical-line');
                itemContent = $('<div/>').css({'height': +h + 'px'});
            }

            item.append(itemTime).append(itemContent);
            lineElement.append(item);
            mainLineElementItemObjArray.push(obj);

        }
        if (this.config.typeOfView === "horizontal") {
            lineElement.append('<style>.horizontal-line:before{width: ' + heightMainLine + 'px;}</style>')
        }
        return lineElement;
    };

    /**
     * Build Event line element
     * @param data
     * @param side
     */
    TimelineCV.prototype.createEventLineElementVertical = function (data, side, color) {

        var $this = this;
        var classElementDescription = this.config.eventDescClassRight;
        var classElement = $this.config.eventLineClassRight;
        var margin = this.config.mainLinePointPadding;
        var wayMargin = 15;
        var descMargin = 90;
        switch (side) {
            case 'left':
                classElement = $this.config.eventLineClassLeft;
                wayMargin = -15;
                descMargin = 160;
                margin = -margin - 45;
                classElementDescription = this.config.eventDescClassLeft;
                break;
            case 'right':
                classElement = $this.config.eventLineClassRight;
                wayMargin = 15;
                margin = margin + 35;
                descMargin = 90;
                classElementDescription = this.config.eventDescClassRight;
                break;
        }
        //li
        var endDateTop = $('#' + _getYearMonth(data.endDate)).position().top;
        var startDateTop = $('#' + _getYearMonth(data.startDate)).position().top;
        //div
        var topElement = ((_getYearMonth(data.startDate, 'm') + 1) * 12) + startDateTop;
        var bottomElement = ((_getYearMonth(data.startDate, 'm') + 1) * 12) + endDateTop;
        var heightElement = (bottomElement - topElement);

        var lineEventsCreatedArray = $('.' + classElement);
        if (lineEventsCreatedArray.length > 0) {
            $.each(lineEventsCreatedArray, function (i, item) {
                var x1 = $(item).offset().top - $this.container.children().filter('.' + $this.config.ulContainerClass).offset().top;
                var y1 = x1 + $(item).outerHeight();

                if ((topElement >= x1 && topElement < y1) || (bottomElement >= x1 && bottomElement < y1)) {
                    margin = parseInt($(item).css('margin-left')) + wayMargin;
                }
            });
        }
        var lineEvent = $('<div/>', {'class': classElement}).css({
            'top': topElement + 'px',
            'height': heightElement + 'px',
            'margin-left': margin + 'px',
            //'background': color
        });
        var spanStartDate = $('<span/>').css({'top': '-20px'}).html(new Date(data.startDate).toLocaleDateString());
        var spanEndDate = $('<span/>').css({'top': '108%'}).html(new Date(data.endDate).toLocaleDateString()); // a 4ego ne 109% - plohaya praktika
        lineEvent.before().append(spanStartDate).after().append(spanEndDate);

        var head, desc, icon, line;
        if (side === "left") {
            //date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.company);
            desc = $('<p/>').html(data.position);
        }
        else {
            //date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.institution);
            desc = $('<p/>').html(data.studyType + " on " + data.area);
        }

        /*Date in desc YYYY/mm*/
        /*date = $('<span/>').addClass('icon').html(_getYearMonth(data.startDate) + '/' + parseInt(_getYearMonth(data.startDate, 'm') + 1) + ' - ' +
            _getYearMonth(data.endDate) + '/' + parseInt(_getYearMonth(data.endDate, 'm') + 1));*/

        if (side === 'right')
            icon = $('<span/>').addClass('icon').addClass('icon-library');
        else
            icon = $('<span/>').addClass('icon').addClass('icon-user-tie');

        line = $('<span/>').addClass('dashed-line');



        var descEvent = $('<div/>', {'class': classElementDescription}).css({
            'top': topElement + 'px',
            'height': 'auto',//heightElement / 2 + 'px',
            'color': '#ffffff',
        }).append(icon).append(line).append(head).append(desc);

        if (side === 'left') {
            descEvent.css({'margin-right': descMargin + 'px'});
        } else {
            descEvent.css({'margin-left': margin + descMargin + 'px'});
        }

        //events
        descEvent.hover(function () {
            $(this).toggleClass('hover');//.find('span').toggleClass('hover');
            lineEvent.toggleClass('hover');

        });
        descEvent.click(function () {
            lineEvent.toggleClass('eventline-click');
            $(this).toggleClass('eventline-click').find('span').toggleClass('eventline-click');
        });
        descEvent.mouseleave(function () {
            lineEvent.toggleClass('eventline-click', false);
            $(this).toggleClass('eventline-click', false).find('span').toggleClass('eventline-click', false);
        });

        $('#' + _getYearMonth(data.startDate)).css("color", color).append(lineEvent).append(descEvent);
    }
    ;

    /**
     * Build Event line element
     * @param data
     * @param side
     */
    TimelineCV.prototype.createEventLineElementHorizontal = function (data, side, color) {
        var $this = this;
        var classElementDescription = this.config.eventDescClassTop;
        var classElement = this.config.eventLineClassTop;
        var margin = this.config.mainLinePointPadding;
        var wayMargin = 15;
        var descMargin = 90;
        switch (side) {
            case 'top':
                classElement = $this.config.eventLineClassTop;
                margin = -margin - 15;
                wayMargin = -15;
                descMargin = -180;
                classElementDescription = this.config.eventDescClassTop;
                break;
            case 'bottom':
                classElement = $this.config.eventLineClassBottom;
                margin = margin + 45;
                wayMargin = 15;
                descMargin = 70;
                classElementDescription = this.config.eventDescClassBottom;
                break;
        }
        //li - time(year)
        var startDateLeft = $('#' + _getYearMonth(data.startDate)).position().left + 50;
        var endDateLeft = $('#' + _getYearMonth(data.endDate)).position().left + 50;
        //div
        var leftElement = ((_getYearMonth(data.startDate, 'm') + 1) * 12) + startDateLeft;
        var rightElement = ((_getYearMonth(data.endDate, 'm') + 1) * 12) + endDateLeft;
        var heightElement = (rightElement - leftElement);

        var lineEventsCreatedArray = $('.' + classElement);
        if (lineEventsCreatedArray.length > 0) {
            $.each(lineEventsCreatedArray, function (i, item) {
                var x1 = $(item).offset().left - $this.container.children().filter('.' + $this.config.ulContainerClass).offset().left;
                var y1 = x1 + $(item).outerWidth();

                //if ((startDateLeft + leftElement >= x1 && startDateLeft + leftElement < y1) || (startDateLeft  + heightElement >= x1 && startDateLeft  + heightElement < y1)) {
                if ((leftElement >= x1 && leftElement < y1) || (rightElement >= x1 && rightElement < y1)) {
                    margin = parseInt($(item).css('margin-top')) + wayMargin;
                    //console.log(margin);
                }
            })
        }
        var lineEvent = $('<div/>', {'class': classElement}).css({
            'left': leftElement + 'px',
            'width': heightElement + 'px',
            'margin-top': margin + 'px',
            //'background': color
        });
        var spanStartDate = $('<span/>').html(new Date(data.startDate).toLocaleDateString());
        var spanEndDate = $('<span/>').html(new Date(data.endDate).toLocaleDateString());
        lineEvent.before().append(spanStartDate).after().append(spanEndDate);

        var head, desc, icon, line;

        if (side === "top") {
            //date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.company);
            desc = $('<p/>').html(data.position);
        }
        else {
            //date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.institution);
            desc = $('<p/>').html(data.studyType + " on " + data.area);
        }

        line = $('<span/>').addClass('dashed-line');

        /*Date in desc YYYY/mm*/
        /*date = $('<span/>').addClass('icon').html(_getYearMonth(data.startDate) + '/' + parseInt(_getYearMonth(data.startDate, 'm') + 1) + ' - ' +
         _getYearMonth(data.endDate) + '/' + parseInt(_getYearMonth(data.endDate, 'm') + 1));*/
        if (side === 'bottom')
            icon = $('<span/>').addClass('icon').addClass('icon-library');
        else
            icon = $('<span/>').addClass('icon').addClass('icon-user-tie');

        var descEvent;
        var span = $('<span/>').addClass('');
        descEvent = $('<div/>', {'class': classElementDescription}).css({
            'left': leftElement + 'px',
            'top': margin + descMargin + 'px',
            'width': 'auto',//heightElement / 2 + 'px',
            'color': '#ffffff',
        }).append(icon).append(line).append(head).append(desc);

        //events
        descEvent.hover(function () {
            $(this).toggleClass('hover');//.find('span').toggleClass('hover');
            lineEvent.toggleClass('hover');

        });
        descEvent.click(function () {
            lineEvent.toggleClass('eventline-click');
            $(this).toggleClass('eventline-click').find('span').toggleClass('eventline-click');
        });
        $('#' + _getYearMonth(data.startDate)).css("color", color).append(lineEvent).append(descEvent);
        descEvent.mouseleave(function () {
            lineEvent.toggleClass('eventline-click', false);
            $(this).toggleClass('eventline-click', false).find('span').toggleClass('eventline-click', false);
        });
    }
    ;

    /**
     *
     * @param data
     * @param side
     * @param color
     */
    TimelineCV.prototype.createDescElementVertical = function (data, side, color) {
        var $this = this;
        var classElementDescription = this.config.eventDescClassRight;
        var margin = this.config.mainLinePointPadding;
        var wayMargin = this.config.mainLinePointPadding;
        var descMargin = 90;
        switch (side) {
            case 'left':
                descMargin = 130;
                margin = -margin - 45;
                classElementDescription = this.config.eventDescClassLeft;
                break;
            case 'right':
                margin = margin + 35;
                descMargin = 60;
                classElementDescription = this.config.eventDescClassRight;
                break;
        }
        //li
        var startDateTop = $('#' + _getYearMonth(data.startDate)).position().top;
        //div
        //var topElement = ((_getYearMonth(data.startDate, 'm') + 1) * 12) + startDateTop;

        var head, desc, date, icon, dashedLine;

        if (side === "left") {
            //date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.company);
            desc = $('<p/>').html(data.position);
        }
        else {
            //date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.institution);
            desc = $('<p/>').html(data.studyType + " on " + data.area);
        }
        /*Date in desc YYYY/mm*/
        date = $('<span/>').addClass('icon').html(_getYearMonth(data.startDate) + '/' + parseInt(_getYearMonth(data.startDate, 'm') + 1) + ' - ' +
            _getYearMonth(data.endDate) + '/' + parseInt(_getYearMonth(data.endDate, 'm') + 1));

        dashedLine = $('<span/>').addClass('dashed-line');

        var descEvent = $('<div/>', {'class': classElementDescription}).css({
            'top': startDateTop + wayMargin + 'px',
            'height': 'auto',//heightElement / 2 + 'px',
            'color': '#ffffff',
        }).append(date).append(dashedLine).append(head).append(desc);

        if (side === 'left') {
            descEvent.css({'margin-right': descMargin + 'px'});
        } else {
            descEvent.css({'margin-left': margin + descMargin + 'px'});
        }

        //events
        descEvent.hover(function () {
            $(this).toggleClass('hover');//.find('span').toggleClass('hover');
            //lineEvent.toggleClass('hover');

        });
        descEvent.click(function () {
            //lineEvent.toggleClass('eventline-click');
            //debugger;
            $(this).toggleClass('eventline-click').find('span').toggleClass('eventline-click');
        });
        descEvent.mouseleave(function () {
            //lineEvent.toggleClass('eventline-click', false);
            $(this).toggleClass('eventline-click', false).find('span').toggleClass('eventline-click', false);
        });

        $('#' + _getYearMonth(data.startDate)).css("color", color).append(descEvent);
    }
    ;

    TimelineCV.prototype.createDescElementHorizontal = function (data, side, color) {
        var $this = this;
        var classElementDescription = this.config.eventDescClassBottom;
        var margin = this.config.mainLinePointPadding;
        var wayMargin = this.config.mainLinePointPadding;
        var descMargin = 90;
        switch (side) {
            case 'top':
                margin = -margin - 15;
                wayMargin = -15;
                descMargin = -145;
                classElementDescription = this.config.eventDescClassTop;
                break;
            case 'bottom':
                margin = margin + 45;
                wayMargin = 15;
                descMargin = 60;
                classElementDescription = this.config.eventDescClassBottom;
                break;
        }
        //li - time(year)
        var startDateLeft = $('#' + _getYearMonth(data.startDate)).find('span:first-child').offset().left-15;
        debugger;
        var head, desc, date, icon, line;
        if (side === "top") {
            //date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.company);
            desc = $('<p/>').html(data.position);
        }
        else {
            //date = $('<time/>').html(new Date(data.startDate).toLocaleDateString() + " - " + new Date(data.endDate).toLocaleDateString());
            head = $('<h3/>').html(data.institution);
            desc = $('<p/>').html(data.studyType + " on " + data.area);
        }
        /*Date in desc YYYY/mm*/
        date = $('<span/>').addClass('icon').html(_getYearMonth(data.startDate) + '/' + parseInt(_getYearMonth(data.startDate, 'm') + 1) + ' - ' +
            _getYearMonth(data.endDate) + '/' + parseInt(_getYearMonth(data.endDate, 'm') + 1));
        line = $('<span/>').addClass('dashed-line');
        var descEvent;
        var span = $('<span/>').addClass('');
        descEvent = $('<div/>', {'class': classElementDescription}).css({
            'left': startDateLeft + 'px',
            'margin-left': 0,
            'top': margin + descMargin + 'px',
            //'width': 'auto',//heightElement / 2 + 'px',
            'color': '#ffffff',
        }).append(date).append(line).append(date).append(head).append(desc);

        //events
        descEvent.hover(function () {
            $(this).toggleClass('hover');//.find('span').toggleClass('hover');
            //lineEvent.toggleClass('hover');

        });
        descEvent.click(function () {
            //lineEvent.toggleClass('eventline-click');
            //debugger;
            $(this).toggleClass('eventline-click').find('span').toggleClass('eventline-click');
        });
        descEvent.mouseleave(function () {
            //lineEvent.toggleClass('eventline-click', false);
            $(this).toggleClass('eventline-click', false).find('span').toggleClass('eventline-click', false);
        });

        $('#' + _getYearMonth(data.startDate)).css("color", color).append(descEvent);
    }
    ;


    TimelineCV.prototype.descElementVertical = function (array) {

        $.each(array,function (item) {
           createElement(item);
        });


        function createElement(item){
            var descBlock = $('<div/>');
            var dasheLine = $('<span/>').addClass('dashed-line');;
            var descHeader = $('<h2/>');
            var descText = $('<p/>');
            (fu)
            (item.work!=undefined)?(function () {
                descHeader.html(item.company);
                descText.html(item.position);
            }):(function () {
                descHeader.html(item.institution);
                descText.html(item.studyType);
            });








        }

    }




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