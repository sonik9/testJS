/**
 * Created by Vitalii on 5/9/2016.
 */

'use strict';
(function ($) {

    var defaultConfiguration ={

    }

    /**
     *
     * @param container
     * @param config
     * @constructor
     */
    function Calc(container, config) {
        var _this = this;
        //override default configuration
        _this.config = $.extend(true, {}, defaultConfiguration, config);
        _this.container = container;
        _this.init();
    }


    Calc.prototype.init= function () {
        this.container.append(this.createView());

    }
    
    
    Calc.prototype.createView = function () {
        var _this = this;
        var calcPanel = $('<div/>',{'class':'calc'});
        var text = $('<div>',{'class':'text'}).append($('<p/>'));
        var symbols =[7,8,9,4,5,6,1,2,3,"+",0,"=",".","-"];
        var button = function (i) {
            var element = $('<div/>',{'class':'button'}).html(i);
            return element;
        }
        calcPanel.append(text);
        $.each(symbols,function (i,item) {

           calcPanel.append( _this.buttonEventClickDigit(text,button(item)));
        });
        return calcPanel;
    }
    
    Calc.prototype.buttonEventClickDigit = function (text,button) {
        var _this=this;
        var str = text.find('p');
        button.click(function (e) {
            if(button.html()!='=') {
                //debugger;
                if(str.css('text-align')==='left') {
                    str.append(button.html());
                }else{
                    str.css({'text-align':''}).html(button.html());
                }
            }else{
                str.html(_this.calculate(str.html())).css({'text-align':'right'});
            }
        });
        return button;
    }
    
    Calc.prototype.calculate = function (text) {
        var str=0;
        var sum = text.split('+');
        $.each(sum,function (i, item) {
            str=str+parseFloat(item);
        });
        return str;
    }

    $.fn.calc = function (configuration) {
        new Calc(this.first(), configuration);
        return this.first();
    };
})(jQuery);