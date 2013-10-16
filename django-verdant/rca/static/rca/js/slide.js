// ;setInterval(function(){
//     $("iframe").remove();
// }, 500);

$(window).on("load", function(){
// $(function(){
    var Affix = $('[data-spy="affix"]').eq(0).data('bs.affix').constructor;
    Affix.prototype.disable = function(){
        if(this.$element.length){
            this._$element = this.$element;
            this.$element = $([]);
        }
    };
    Affix.prototype.enable = function(){
        if(this._$element){
            this.$element = this._$element;
        }
    };
});

$(function(){
    $("iframe").remove();
    function pixelToNumber(val){
        return parseInt(("" + val).replace(/[px]+/g, ""), 10);
    }
    var scrollY;

    var headerFullHeight = $(".header-wrapper").height();
    var headerCompactHeight = 34;

    var animate = $.support.transition ? "transition" : "animate";

    $left = $(".wrapper-left");
    $right = $(".wrapper-right");

    function slideRight(){
        $header = $(".header-wrapper");
        $headerLeft = $(".wrapper-left .header-wrapper");
        $headerRight = $(".wrapper-right .header-wrapper");
        var isMobileLayout = $left.css("padding-left") != "0px";
        $('[data-spy="affix"]').each(function(){
            if(isMobileLayout){
                if($(this).data("bs.affix")){
                    $(this).data("bs.affix").disable();
                }
            }else{
                if(!$(this).data("bs.affix")){
                    $(this).affix();
                }
                if($(this).closest(".wrapper-right").length){
                    $(this).data("bs.affix").enable();
                }
            }
        });

        var scrollY = window.scrollY;
        scrollYLeft = scrollY;
        $left.wrap('<div class="slider"/>').parent().append($right);
        $slider = $(".slider");

        $left.css({
            width: $("body").width(),
            float: "left"
        });
        $right.css({
            position: "static",
            width: $("body").width()
        });

        $("body").css({
            overflowX: "hidden"
        });
        $slider.css({
            width: "200%"
        });
        $right.css({
            paddingTop: scrollY + 14
        });

        if(!isMobileLayout && ($headerLeft.height() < 80)){
            $headerRight
            .removeClass("affix").addClass("affix-top")
            .css({
                left:"100%",
                top: 0,
                position: "fixed",
                marginLeft: "5%"
            });
            if($headerRight.data("bs.affix")){
                $headerRight.data("bs.affix").disable();
            }
        }

        $slider[animate]({
            marginLeft: "-100%"
        }, 1000, function(){
            $right.css({
                paddingTop: 0
            });
            $(window).scrollTop(1);
            $(window).scrollTop(0);

            if(!isMobileLayout && ($headerLeft.height() < 80)){
                $right.children(".page-wrapper").removeClass("affix").addClass("affix-top");
                $headerRight
                    .css("position", "static")
                    .affix();
                $headerRight.attr("style", "");
                $headerRight.data("bs.affix").enable();
            }

            $left.css({
                position: "fixed",
                left: "-100%",
                top: scrollY,
                width: "90%"
            });
            $right.css({
                width: "100%"
            });
            $("body").css({
                overflowX: "auto"
            });
            $left.unwrap();
        });

        $headerLeft.data("bs.affix").disable();
        $headerLeft[animate]({
            left: "-200%"
        }, 1000, function(){});
        $headerRight[animate]({
            left: "0"
        }, 1000, function(){});
    }

    function slideLeft(){
        $header = $(".header-wrapper");
        $headerLeft = $(".wrapper-left .header-wrapper");
        $headerRight = $(".wrapper-right .header-wrapper");
        var isMobileLayout = $left.css("padding-left") != "0px";
        $('[data-spy="affix"]').each(function(){
            if(isMobileLayout){
                if($(this).data("bs.affix")){
                    $(this).data("bs.affix").disable();
                }
            }else{
                if(!$(this).data("bs.affix")){
                    $(this).affix();
                }
                $(this).data("bs.affix").enable();
            }
        });

        var rightOffset = $right.offset();
        $left.wrap('<div class="slider"/>').parent().append($right);
        $slider = $(".slider");

        $left.css({
            width: $("body").width(),
            float: "left",
            position: "static"
        });
        $right.css({
            width: $("body").width(),
            position: "relative",
            top: scrollYLeft - window.scrollY,
            left:0
        });
        $(window).scrollTop(scrollYLeft);
        $("body").css({
            overflowX: "hidden"
        });
        $slider.css({
            marginLeft: "-100%",
            width: "200%"
        });

        if(!isMobileLayout && ($headerRight.height() > 80)){
            $right.children(".page-wrapper").addClass("no-affix");
        }

        $slider[animate]({
            marginLeft: "0"
        }, 1000, function(){
            $right.css({
                position: "fixed",
                left: "100%",
                width: "100%",
                top: 0,
                paddingTop:0
            });
            $left.css({
                width: "100%",
                position: "static"
            });
            $("body").css({
                overflowX: "auto"
            });
            $left.unwrap();
            $right.children(".page-wrapper").removeClass("no-affix");
        });


        $headerLeft[animate]({
            left: "0"
        }, 1000, function(){});
        if($headerRight.data("bs.affix")){
            $headerRight.data("bs.affix").disable();
        }
        $headerRight[animate]({
            left: "100%"
        }, 1000, function(){});
    }

    window.slideRight = slideRight;
    window.slideLeft = slideLeft;

    if($.support.pjax){
        $.pjax.defaults.timeout = 100000;
        $.pjax.defaults.scrollTo = null;
        origin = location.protocol + "//" + location.host;
        // add pjax to links pinting to sub-pages
        $left.on("click", "a[href^='" + location.pathname + "'], a[href^='" + origin + location.pathname + "']", function(event){
            $.pjax.click(event, {container: $right.selector, fragment: $left.selector});
            nextSlide = "right";
            return false;
        });
        // add pjax to links pinting to the parent page
        // $right.on("click", "a[href='" + origin + location.pathname.split("/").slice(0,-2).join("/") + "/" + "']", function(){
        $right.on("click", "a", function(){
            leftStyle = $left.attr("style");
            nextSlide = "left";
            $.pjax.click(event, {container: $left.selector, fragment: $left.selector});
            return false;
        });


        $(document).on('pjax:end', function(event) {
            // $('#loading').hide()
            if(window.leftStyle){
                $left.attr("style", leftStyle);
            }

            $('[data-spy="affix"]').each(function () {
              var $spy = $(this);
              var data = $spy.data();

              data.offset = data.offset || {};

              if (data.offsetBottom) data.offset.bottom = data.offsetBottom;
              if (data.offsetTop)    data.offset.top    = data.offsetTop;

              $spy.affix(data);
            });

            if(nextSlide == "right"){
                slideRight();
            }else if(nextSlide == "left"){
                slideLeft();
            }else{
                if(pixelToNumber($(".wrapper-left").css("left")) < 0){
                    slideLeft();
                }else{
                    slideRight();
                }
            }
            nextSlide = null;
        });
    }
});
