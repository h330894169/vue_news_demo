/***
 * $(".lazyLoad").scrollLoad({
        //url:"index.html",
        //pageNo:1,
        callback:function(element, settings){
            this
            console.log(element.pageNo);
            //这里模拟发送请求
            setTimeout(function(){
                $(element).append(" &nbsp;"+ element.pageNo);
                element.is_busy = false;
                $.showLoading(element,false)
            },1000);
        }
    });
 */
(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.scrollLoad = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            container       : window,
            skip_invisible  : false,
            load            : null,
            loading     : "<div class='loading'>loading...</div>"
        };

        function update() {
            var counter = 0;
            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.inviewport(this, settings) && !this.is_busy){
                    this.is_busy = true;
                    if(settings.callback){
                        $.showLoading(this,true);
                        settings.callback(this, settings);
                    }
                    this.pageNo = (this.pageNo||1) +1;
                }
            });
        }

        $.showLoading = function(element,is_show){
            is_show?$(element).find(".loading").appendTo(element).show():$(element).find(".loading").appendTo(element).hide();
        }


        if(options) {
            options.pageNo = options.pageNo || 1;
            $.extend(settings,options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
            settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);
            $self.append($(settings.loading).hide());
            self.is_busy = false;
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
            !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };


})(jQuery, window, document);