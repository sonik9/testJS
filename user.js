;(function($){

    /**
     * Default configuration for plugin
     * @type {{containerClass: string, formClass: string, buttonClass: string, ajaxconfiguration: {url: string, type: string, contentType: string, dataType: string}, errorMessage: string, errorClass: string}}
     */
        var defaultConfiguration = {
        containerClass: "pluginName-class",
        ajaxConfiguration:{
            url: "",
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        },
        errorMessage: "",
        errorClass: "pluginName-error-message"
    };

    /**
     * Creating a global constructor for plagin object
     * @param container
     * @param configuration
     * @constructor
     */
    function Plugin(container, configuration){
        var $this = this;
        //override default configuration
        $this.config = $.extend(true, {}, defaultConfiguration, configuration);
        
        $this.container = container;
        
        /**
         * Describe events handler
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
         * 
         */
        $.each($this.config, function(key, value){
            if(typeof value === 'function'){
                $this.container.on(key + '.pluginName', function(e, param){
                    return value(e, $this.container, param);
                });
            }
        });

        //Initialize plugin
        $this.init();
    }

    /**
     * Initialization method 
     */
    Plugin.prototype.init = function(){
        this.container.addClass(this.config.containerClass);

        

        this.container.trigger('created.npoll');
    }

    /**
     * Add plugin to jQuery prototype
     * @param configuration
     * @returns {*}
     */
    $.fn.pluginName = function(configuration){
        new Plugin(this.first(), configuration);
        return this.first();
    };

})(jQuery);