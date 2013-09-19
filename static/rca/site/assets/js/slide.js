
;setInterval(function(){
    $("iframe").remove();
}, 200);

// $(window).on("load", function(){
$(function(){
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
        return parseInt(("" + val).replace(/[\-px]+/g, ""), 10);
    }
    $left = $(".wrapper-left");
    $right = $(".wrapper-right");
    $header = $(".header-wrapper");
    $headerLeft = $(".wrapper-left .header-wrapper");
    $headerRight = $(".wrapper-right .header-wrapper");
    var scrollY;

    var headerFullHeight = $(".header-wrapper").height();
    var headerCompactHeight = 34;

    $(document).pjax('.wrapper-left a[data-pjax]', '.wrapper-right');

    var animate = $.support.transition ? "transition" : "animate";

    function slideRight(){
        var isMobileLayout = $left.css("padding-left") != "0px";
        $('[data-spy="affix"]').each(function(){
            if(isMobileLayout){
                $(this).data("bs.affix").disable();
            }else{
                $(this).data("bs.affix").enable();
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
            paddingTop: scrollY
        });

        if(!isMobileLayout && ($headerLeft.height() < 80)){
            $headerRight
            .removeClass("affix").addClass("affix-top")
            .css({
                left:"100%",
                top: 0,
                position: "fixed",
                marginLeft: "5%"
            })
            .data("bs.affix").disable();
        }

        $slider[animate]({
            marginLeft: "-100%"
        }, 1000, function(){
            $right.css({
                paddingTop: 0
            });
            $(window).scrollTop(0);

            if(!isMobileLayout && ($headerLeft.height() < 80)){
                $right.children(".page-wrapper").removeClass("affix").addClass("affix-top");
                $headerRight
                    .css("position", "static")
                    .data("bs.affix").enable();
                $headerRight.attr("style", "");
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


        $headerLeft[animate]({
            left: "-200%"
        }, 1000, function(){});
        $headerRight[animate]({
            left: "0"
        }, 1000, function(){});
    }

    function slideLeft(){
        var isMobileLayout = $left.css("padding-left") != "0px";
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
                width: "100%"
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

        $headerRight.data("bs.affix").disable();
        $headerRight[animate]({
            left: "100%"
        }, 1000, function(){});
    }

    $left.on("click", "a", function(){
        slideRight();
        return false;
    });

    $right.on("click", "a", function(){
        // window.history.pushState(null, "", "programme.html");
        slideLeft();
        return false;
    });

});
