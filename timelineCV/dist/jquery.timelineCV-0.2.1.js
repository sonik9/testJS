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
        containerClass: "timeline-cv",
        mainBlockClass: 'timeline-cv-mainblock',
        horizontalMainLineClass: 'horizontal-mainline',
        verticalMainLineClass: 'vertical-mainline',
        eventDescClass: 'timeline-cv-eventdesc',
        eventLineClass: 'timeline-cv-eventline',
        iconClass: ['icon-user-tie', 'icon-library', 'icon-spinner11', 'icon-eye', 'icon-file-pdf'],
        timelineButtonsClass: 'timeline-buttons',
        //
        mainBlockArea: 35, //25px
        heightMainArea: 250,

        eventLineClassLeft: 'timeline-cv-eventline-left',
        eventLineClassRight: 'timeline-cv-eventline-right',

        eventDescClassRight: 'timeline-cv-eventdesc-right',

        eventLineClassTop: 'timeline-cv-eventline-top',
        eventLineClassBottom: 'timeline-cv-eventline-bottom',
        eventDescClassTop: 'timeline-cv-eventdesc-top',
        eventDescClassBottom: 'timeline-cv-eventdesc-bottom',

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
    //var mainLineElementItemObjArray = [];
    /**
     * Service functions
     */



    /**
     *
     * @param startDate
     * @param type
     * @returns {number}
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
     * Util func to collecting object to array
     * @param data
     * @param nodeArray
     * @param sort
     * @returns {Array}
     */
    TimelineCV.prototype.dataToArray = function (data, nodeArray, sort) {
        var array = [];
        nodeArray.forEach(function (item) {
            data[item].forEach(function (obj) {
                array.push(obj);
            });
        });
        array.sort(function (a, b) {
            return _getYearMonth(a.startDate) - _getYearMonth(b.startDate);
        });
        return array;
    }

    /**
     * Util func to collecting years to array
     * @param array
     * @param startDate
     * @param endDate
     */
    TimelineCV.prototype.collectYear = function (array) {
        var createdArray = [];
        $.each(array, function (i, item) {
            if (!createdArray.find(function (i) {
                    //debugger;
                    if (i.date === _getYearMonth(item.startDate))
                        return true;
                })) {
                createdArray.push({date: _getYearMonth(item.startDate), obj: item});
            }
            if (!createdArray.find(function (i) {
                    if (i.date === _getYearMonth(item.endDate))
                        return true;
                })) {
                createdArray.push({date: _getYearMonth(item.endDate), obj: item});
            }
        });
        createdArray.sort(function (a, b) {
            return a.date - b.date;
        });
        return createdArray;
    }

    /**
     * Creating a global constructor for plagin object
     * @param container
     * @param configuration
     * @constructor
     */
    function TimelineCV(container, configuration) {
        var _this = this; // eto bred, 4erez $ objavlajutsya peremennije jQuery
        //override default configuration
        _this.config = $.extend(true, {}, defaultConfiguration, configuration);
        _this.container = container; // ispolzui this.$container - tak budet ponyatno 4to eto jQuery object
        _this.buttonTypeChange = $('<div/>').addClass(_this.config.timelineButtonsClass)
            .addClass(_this.config.iconClass[3]).addClass('button-type-change');
        _this.buttonDirectionChange = $('<div/>').addClass(_this.config.timelineButtonsClass)
            .addClass(_this.config.iconClass[2]).addClass('button-direction-change');
        /**
         * Describe default events handler
         */
        $(window).resize(function (e) {
            if ($(window).innerWidth() + 17 < 900) {
                console.log($(window).innerWidth());
                if (_this.config.typeOfTimeline !== "default") {
                    _this.config.typeOfTimeline = "default";
                    _this.reload();
                }
            }
            /*else if($(window).innerWidth()>920){
             if(window.currentTypeOfTimeline !== "default") {
             $(_this.container).find('.timeline-cv').remove();
             _this.config.typeOfTimeline = "expanded";
             _this.init(_this.config.data);
             }
             }*/
        });

        /*_this.container.click(function () {
         $(_this.container).find('.timeline-cv').remove();

         if(_this.config.typeOfTimeline === "default") {
         _this.config.typeOfTimeline = "expanded"
         }else

         _this.config.typeOfTimeline= "default";


         _this.init(_this.config.data);
         });*/

        /*
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
        $.each(_this.config, function (key, value) {
            if (typeof value === 'function') {
                _this.container.on(key + '.timelineCV', function (e, param) {
                    return value(e, _this.container, param);
                });
            }
        }); // .bind(this) pered ')'

        //Initialize TimelineCV
        _this.init(_this.config.data);

    }

    /**
     * Funtion for reload object timelineCV
     */
    TimelineCV.prototype.reload = function () {
        $(this.container).find('.timeline-cv').remove();
        $(this.container).find('.detail-block').remove();
        this.init(this.config.data);
    }
    /**
     * Initialization method
     */
    TimelineCV.prototype.init = function (data) {
        var _this = this;
        var _array = _this.dataToArray(data, ['work', 'education']);
        //this.container.addClass(this.config.containerClass);

        switch (_this.config.typeOfTimeline) {
            case "expanded":
            {
                _this.container.append(_this.createMainLineElement(_this.collectYear(_array)));
                switch (_this.config.typeOfView) {

                    case "vertical":
                    {
                        $('.timeline-cv').addClass('timeline-vertical');
                        _this.descElementVertical(_array);
                        break;
                    }
                    /* case "horizontal":
                     {
                     $('.timeline-cv').addClass('timeline-horizontal');
                     _this.descElementHorizontal(_array);
                     break;
                     }*/
                }
                break;
            }
            case "default":
            {
                var mainLineElements = _this.createMainLineElement(_array);
                this.container.append(mainLineElements);
                switch (_this.config.typeOfView) {
                    case "vertical":
                    {
                        $('.timeline-cv').addClass('timeline-vertical');
                        _this.descElementVertical(_array);
                        break;
                    }
                    case "horizontal":
                    {
                        $('.timeline-cv').addClass('timeline-horizontal');
                        _this.descElementHorizontal(_array);

                        var w = 0;
                        $(mainLineElements).find('.main-area').each(function (i, item) {
                            w += item.offsetWidth;
                        });
                        $(mainLineElements).append('<style>.horizontal-mainline:before{width: ' + w + 'px;}</style>')
                        break;
                    }
                }
                break;
            }
        }
        _this.container.append(_this.createDescDetailElement(_array));
        //Users event handlers implemented in callbacks as function
        _this.container.trigger('created.timelineCV');
        _this.elementEvents();
    };

    /**
     * All elements event describe
     */
    TimelineCV.prototype.elementEvents = function () {
        //events
        var _this = this;
        _this.buttonTypeChange.click(function () {
            console.log('type change');
            if (_this.config.typeOfTimeline !== "default") {
                _this.config.typeOfTimeline = "default";
                _this.reload();
            } else {
                _this.config.typeOfTimeline = "expanded";
                _this.reload();
            }
        });

        _this.buttonDirectionChange.click(function () {
            console.log('direction change');
            if (_this.config.typeOfView !== "vertical") {
                _this.config.typeOfView = "vertical";
                _this.reload();
            } else {
                _this.config.typeOfView = "horizontal";
                _this.config.typeOfTimeline = "default";
                _this.reload();
            }
        });

        var descEvent = $('.timeline-cv-eventdesc');
        $(descEvent).each(function (i, item) {
            $(this).hover(function () {
                $(item).toggleClass('hover');//.find('span').toggleClass('hover');
                //lineEvent.toggleClass('hover');
            });
            $(this).click(function () {
                $('.detail-block').find('.select-detail-item').each(function (i,item) {
                    $(item).removeClass('select-detail-item');
                });
                $(item).toggleClass('eventline-click').find('span').toggleClass('eventline-click');
                var target = $('.detail-block').find('p[id='+$(item).attr('id')+']')[0];
                $('html, body').stop().animate({
                    'scrollTop': $(target).offset().top + 2
                }, 500, 'swing', function () {
                    window.location.hash = target;
                    // $(document).on("scroll", $().onScroll(this, 'active'));
                });
                $(target).addClass('select-detail-item');

            });
            $(this).mouseleave(function () {
                //lineEvent.toggleClass('eventline-click', false);
                $(item).toggleClass('eventline-click', false).find('span').toggleClass('eventline-click', false);
            });
        });
    }
    ;

    /**
     * Creating new element of main line
     * @param array
     * @returns {void|*}
     */
    TimelineCV.prototype.createMainLineElement = function (array) {
        var _this = this;
        var widthMainLine = 250;

        var lineElement = $('<div/>').addClass(_this.config.containerClass);//.append(_this.buttonTypeChange).append(_this.buttonDirectionChange);
        if (_this.config.typeOfView === 'vertical') {
            lineElement.append(_this.buttonTypeChange).append(_this.buttonDirectionChange);
        } else {
            lineElement.append(_this.buttonDirectionChange);
        }
        $.each(array, function (i, item) {
            if (_this.config.typeOfTimeline === 'default') {
                blockCrete(item, array.length);
            }
            else if (_this.config.typeOfTimeline === 'expanded') {
                blockCrete(item.obj, array.length, item.date, i);

            }
        });
        /**
         *
         * @param item
         * @param arrayLength
         * @param year
         * @param i
         */
        function blockCrete(item, arrayLength, year, i) {
            var startDate = item.startDate;
            var endDate = item.endDate;
            var betweenNext = 1;
            //Image blocks or year
            var icon = $('<span/>');
            var mainArea = $('<div/>', {'id': year, 'date': startDate}).addClass('main-area');
            /*Date in blocks*/
            /* var icon = $('<span/>').html(_getYearMonth(obj.date) + '/' + (parseInt(_getYearMonth(obj.date, 'm')) + 1)
             +' '+_getYearMonth(obj.endDate) + '/' + (parseInt(_getYearMonth(obj.endDate, 'm')) + 1));*/

            if (_this.config.typeOfTimeline === 'default') {
                if (item.company != undefined) {
                    icon.addClass(_this.config.iconClass[0]);
                } else if (item.institution != undefined) {
                    icon.addClass(_this.config.iconClass[1]);
                } else
                    icon.html(_getYearMonth(item.startDate));
            }
            else if (_this.config.typeOfTimeline === 'expanded') {
                icon.html(year).css({'margin-left': '-13px'});
            }
            //Block
            var itemBlock = $('<div/>', {
                'id': _getYearMonth(startDate),
                'class': _this.config.mainBlockClass,
                'datetime': item.startDate
            }).append(icon);
            //itemBlock.append('<style>.timeline-cv-mainblock:after{left:'+left+'px; width: ' + h + 'px;}</style>');
            if (_this.config.typeOfView === "vertical") {
                //mainArea.css({'min-width': 100 % +'px', 'min-height': h + 'px'});
                //itemBlock.css({'margin-left': -_this.config.mainBlockArea - 20 + 'px'});
                lineElement.addClass(_this.config.verticalMainLineClass)
            } else if (_this.config.typeOfView === "horizontal") {
                //mainArea.css({'min-width': h + 'px'});
                lineElement.addClass(_this.config.horizontalMainLineClass);
                //itemBlock.css({'left': h*i + 'px'});
            }
            mainArea.append(itemBlock);
            lineElement.append(mainArea)

            //Counting width og main line for expanded - horizontal mode only
            var h = 250;
            if (_this.config.typeOfTimeline === "expanded") {
                widthMainLine = widthMainLine + (h / 2 + _this.config.mainBlockArea);
            } else {
                widthMainLine = (h * arrayLength);// - (_this.config.mainBlockArea * arrayLength);
            }
        }

        if (this.config.typeOfView === "horizontal") {
            //    lineElement.append('<style>.horizontal-mainline:before{width: ' + widthMainLine + 'px;}</style>')
        }
        return lineElement;
    };

    TimelineCV.prototype.descElementHorizontal = function (array) {
        var _this = this;

        $.each(array, function (i, item) {
            if (_this.config.typeOfTimeline === 'default') {
                createElementDesc(item);
            }
            else if (_this.config.typeOfTimeline === 'expanded') {
                createElementEventLine(item);

            }
        });
        /**
         * Only for expanded mode
         * @param item
         */
        function createElementEventLine(item) {
            var lineEvent = $('<div/>', {'class': _this.config.eventLineClass});
            var mainAreaStart = $('#' + _getYearMonth(item.startDate));
            var mainAreaEnd = $('#' + _getYearMonth(item.endDate));
            //main area
            var startDateTop = mainAreaStart.position().top;
            var endDateTop = mainAreaEnd.position().top;
            //event line
            var halfBlockTop = startDateTop + _this.config.mainBlockArea * 1.5;
            var halfBlockBottom = endDateTop + _this.config.mainBlockArea * 1.5;
            var elementTop = halfBlockTop + (_this.config.heightMainArea / 12) * _getYearMonth(item.startDate, 'm');
            var elementBottom = halfBlockBottom + (_this.config.heightMainArea / 12) * _getYearMonth(item.endDate, 'm');
            var elementHeight = (elementBottom - elementTop);
            var margin = 15;

            if (item.company === undefined) {
                lineEvent.addClass('right');//.css({'margin-left':'-13%'});
                var lineEventsCreatedArray = $('.' + _this.config.eventLineClass + '.right');
                cross(lineEventsCreatedArray, 15)
            } else {
                lineEvent.addClass('left');//.css({'margin-left':'12%'});
                var lineEventsCreatedArray = $('.' + _this.config.eventLineClass + '.left');
                cross(lineEventsCreatedArray, -15)

            }
            /**
             *
             * @param array
             * @param delta
             */
            function cross(array, delta) {
                if (array.length > 0) {
                    $.each(array, function (i, a) {
                        var x = $(a).offset().top;// - $this.container.children().filter('.' + _this.config.ulContainerClass).offset().top;
                        var y = x + $(a).outerHeight();
                        var leftItem = $(a).css('margin-left');
                        var leftCurr = lineEvent.css('margin-left');
                        if ((elementTop >= x && elementTop < y) || (elementBottom >= x && elementBottom < y)) {
                            margin = parseInt($(a).css('margin-left'));
                            lineEvent.css({'margin-left': margin + delta + 'px'});
                        }
                    });
                }
            }

            lineEvent.css({
                'top': elementTop + 'px',
                'height': elementHeight + 'px',
            });
            var spanStartDate = $('<span/>').css({'top': '-20px'}).html(new Date(item.startDate).toLocaleDateString());
            var spanEndDate = $('<span/>').css({'top': '108%'}).html(new Date(item.endDate).toLocaleDateString()); // a 4ego ne 109% - plohaya praktika
            lineEvent.before().append(spanStartDate).after().append(spanEndDate);
            lineEvent = createElementDesc(item, lineEvent);
            mainAreaStart.append(lineEvent);
            /**
             * Change style of description element after it creating
             */
            $(mainAreaStart).find('.timeline-cv-eventdesc.right').css({
                'left': '105px',
                'margin-top': '10px'
            });
            $(mainAreaStart).find('.timeline-cv-eventdesc.left').css({
                'right': '105px',
                'margin-top': '10px'
            });
        }

        /**
         *
         * @param item
         */
        function createElementDesc(item, lineEvent) {
            var descBlock = $('<div/>',{'id':item.startDate}).addClass(_this.config.eventDescClass);
            var dashedLine = $('<span/>').addClass('dashed-line');
            var descHeader = $('<h3/>');
            var descPosition = $('<p/>');
            var descSummary = $('<p/>').addClass('summary');
            /*Date in desc YYYY/mm*/
            var descIcon = $('<span/>').addClass('icon').html(_getYearMonth(item.startDate) + '/' + parseInt(_getYearMonth(item.startDate, 'm') + 1) + ' - ' +
                _getYearMonth(item.endDate) + '/' + parseInt(_getYearMonth(item.endDate, 'm') + 1));
            var iconImage = $('<span/>').addClass('iconImage');
            var mainArea = $('[date=' + item.startDate + ']');
            var withDesc = 1;

            if (item.company === undefined) {
                iconImage.addClass(_this.config.iconClass[1]);
                descHeader.html(item.institution);
                descPosition.html(item.studyType);
                descSummary.html(item.area);
                descBlock.addClass('top');
                if (item.institution.split(" ").length > 2)
                    withDesc = item.institution.split(" ").length * 0.3;

            } else {
                iconImage.addClass(_this.config.iconClass[0]);
                descHeader.html(item.company);
                descPosition.html("As a " + item.position);
                descSummary.html(item.summary);
                descBlock.addClass('bottom');
                if (item.company.split(" ").length > 2)
                    withDesc = item.company.split(" ").length * 0.3;
            }
            descBlock.append(dashedLine).append(descHeader).append(descPosition).append(descSummary);

            if (lineEvent != undefined) {
                descBlock.append(descIcon).append(iconImage);
                lineEvent.withDesc = withDesc;
                lineEvent.append(descBlock);
                return lineEvent;
            } else {
                descIcon.addClass('default');
                descBlock.append(descIcon);
                mainArea.append(descBlock);
            }
        }
    };

    /**
     *
     * @param array
     */
    TimelineCV.prototype.descElementVertical = function (array) {
        var _this = this;

        $.each(array, function (i, item) {
            if (_this.config.typeOfTimeline === 'default') {
                createElementDesc(item);
            }
            else if (_this.config.typeOfTimeline === 'expanded') {
                createElementEventLine(item);

            }
        });
        /**
         * Only for expanded mode
         * @param item
         */
        function createElementEventLine(item) {
            var lineEvent = $('<div/>', {'class': _this.config.eventLineClass});
            var mainAreaStart = $('#' + _getYearMonth(item.startDate));
            var mainAreaEnd = $('#' + _getYearMonth(item.endDate));
            //main area
            var startDateTop = mainAreaStart.position().top;
            var endDateTop = mainAreaEnd.position().top;
            //event line
            var halfBlockTop = startDateTop + _this.config.mainBlockArea * 1.5;
            var halfBlockBottom = endDateTop + _this.config.mainBlockArea * 1.5;
            var elementTop = halfBlockTop + (_this.config.heightMainArea / 12) * _getYearMonth(item.startDate, 'm');
            var elementBottom = halfBlockBottom + (_this.config.heightMainArea / 12) * _getYearMonth(item.endDate, 'm');
            var elementHeight = (elementBottom - elementTop);
            var margin = 15;

            if (item.company === undefined) {
                lineEvent.addClass('right');//.css({'margin-left':'-13%'});
                var lineEventsCreatedArray = $('.' + _this.config.eventLineClass + '.right');
                cross(lineEventsCreatedArray, 15)
            } else {
                lineEvent.addClass('left');//.css({'margin-left':'12%'});
                var lineEventsCreatedArray = $('.' + _this.config.eventLineClass + '.left');
                cross(lineEventsCreatedArray, -15)

            }
            /**
             *
             * @param array
             * @param delta
             */
            function cross(array, delta) {
                if (array.length > 0) {
                    $.each(array, function (i, a) {
                        var x = $(a).offset().top;// - $this.container.children().filter('.' + _this.config.ulContainerClass).offset().top;
                        var y = x + $(a).outerHeight();
                        var leftItem = $(a).css('margin-left');
                        var leftCurr = lineEvent.css('margin-left');
                        if ((elementTop >= x && elementTop < y) || (elementBottom >= x && elementBottom < y)) {
                            margin = parseInt($(a).css('margin-left'));
                            lineEvent.css({'margin-left': margin + delta + 'px'});
                        }
                    });
                }
            }

            lineEvent.css({
                'top': elementTop + 'px',
                'height': elementHeight + 'px',
            });
            var spanStartDate = $('<span/>').addClass('top').html(new Date(item.startDate).toLocaleDateString());
            var spanEndDate = $('<span/>').addClass('bottom').html(new Date(item.endDate).toLocaleDateString()); // a 4ego ne 109% - plohaya praktika
            lineEvent.before().append(spanStartDate).after().append(spanEndDate);
            lineEvent = createElementDesc(item, lineEvent);
            mainAreaStart.append(lineEvent);
            /**
             * Change style of description element after it creating
             */
            $(mainAreaStart).find('.timeline-cv-eventdesc.right').css({
                'left': '105px',
                'margin-top': '10px'
            });
            $(mainAreaStart).find('.timeline-cv-eventdesc.left').css({
                'right': '105px',
                'margin-top': '10px'
            });
        }

        /**
         *
         * @param item
         */
        function createElementDesc(item, lineEvent) {
            var descBlock = $('<div/>',{'id':item.startDate}).addClass(_this.config.eventDescClass);
            var dashedLine = $('<span/>').addClass('dashed-line');
            var descHeader = $('<h3/>');
            var descPosition = $('<p/>');
            var descSummary = $('<p/>').addClass('summary');
            /*Date in desc YYYY/mm*/
            var descIcon = $('<span/>').addClass('icon').html(_getYearMonth(item.startDate) + '/' + parseInt(_getYearMonth(item.startDate, 'm') + 1) + ' - ' +
                _getYearMonth(item.endDate) + '/' + parseInt(_getYearMonth(item.endDate, 'm') + 1));
            //debugger;
            var iconImage = $('<span/>').addClass('iconImage');
            var mainArea = $('[date=' + item.startDate + ']');
            var withDesc = 1;

            if (item.company === undefined) {
                iconImage.addClass(_this.config.iconClass[1]);
                descHeader.html(item.institution);
                descPosition.html(item.studyType);
                descSummary.html(item.summary);
                descBlock.addClass('right');
                if (item.institution.split(" ").length > 2)
                    withDesc = item.institution.split(" ").length * 0.3;

            } else {
                iconImage.addClass(_this.config.iconClass[0]);
                descHeader.html(item.company);
                descPosition.html("As a " + item.position);
                descSummary.html(item.summary);
                descBlock.addClass('left');
                if (item.company.split(" ").length > 2)
                    withDesc = item.company.split(" ").length * 0.3;
            }
            descBlock.append(dashedLine).append(descHeader).append(descPosition).append(descSummary);

            if (lineEvent != undefined) {
                descBlock.append(descIcon).append(iconImage);
                lineEvent.withDesc = withDesc;
                lineEvent.append(descBlock);
                return lineEvent;
            } else {
                descIcon.addClass('default');
                //iconImage.addClass('default');
                descBlock.append(descIcon);//.append(iconImage);
                mainArea.append(descBlock);
            }
        }
    };

    TimelineCV.prototype.createDescDetailElement = function (array) {
        var detailBlock = $('<div/>').addClass('detail-block');
        var jobSection = $('<section/>').addClass('job-section');
        var eduSection = $('<section/>').addClass('edu-section');
        var jobArticle = $('<article/>', {'id': 'job'}).addClass('article');
        var eduArticle = $('<article/>', {'id': 'edu'}).addClass('article');
        var jobArticleHeader = $('<h3/>').html('Work expirience');
        var eduArticleHeader = $('<h3/>').html('Education');

        var jobList = $('<ul/>').addClass('job-list');
        var eduList = $('<ul/>').addClass('job-list');
        //debugger;
        array.sort(function (a,b) {
            //debugger;
           return _getYearMonth(b.startDate)-_getYearMonth(a.startDate);
        });
        array.forEach(function (item, i) {

            if (item.company !== undefined) {
                var job = $('<p/>',{'id':item.startDate}).html(item.position + " - " + item.company + " | " + new Date(item.startDate).toLocaleDateString() + " - " + new Date(item.endDate).toLocaleDateString() + " | " + item.location);
                var jobItem = $('<li/>').addClass('job-item');
                var highlightList = $('<ul/>').addClass('highlight-list');
                item.highlights.forEach(function (item) {
                    var highlightItem = $('<li/>').addClass('highlight-item');
                    var highlight = $('<p/>').html(item);
                    highlightList.append(highlightItem.append(highlight));
                });
                jobList.append(jobItem.append(job.append(highlightList)));
            } else if (item.institution !== undefined) {
                var edu = $('<p/>',{'id':item.startDate}).html(item.institution + " | " + new Date(item.startDate).toLocaleDateString() + " - " + new Date(item.endDate).toLocaleDateString() + " | " + item.location);
                var eduItem = $('<li/>').addClass('edu-item');
                var courseList = $('<ul/>').addClass('course-list');
                item.courses.forEach(function (item1) {
                    var courseItem = $('<li/>').addClass('course-item');
                    var course = $('<p/>').html(item1+" - "+item.studyType);
                    courseList.append(courseItem.append(course));
                });
                eduList.append(eduItem.append(edu.append(courseList)));
            }

        });

        jobArticle.append(jobArticleHeader).append(jobList);
        eduArticle.append(eduArticleHeader).append(eduList);
        ;

        detailBlock.append(jobSection.append(jobArticle)).append(eduSection.append(eduArticle));
        return detailBlock;
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