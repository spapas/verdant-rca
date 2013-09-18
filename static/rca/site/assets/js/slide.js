
;setInterval(function(){
    $("iframe").remove();
}, 200);

$(window).on("load", function(){
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
    var scrollY;

    var headerFullHeight = $(".header-wrapper").height();
    var headerCompactHeight = 34;

    $(document).pjax('.wrapper-left a[data-pjax]', '.wrapper-right');

    function slideRight(){
        var scrollY = window.scrollY;
        scrollYLeft = scrollY;
        $left.wrap('<div class="slider"/>').parent().append($right);
        $slider = $(".slider");

        $left.css({
            width: $left.width(),
            float: "left"
        });
        $right.css({
            position: "static",
            width: $left.width()
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
        $slider.animate({
            marginLeft: "-100%"
        }, 1000, function(){
            $right.css({
                paddingTop: 0
            });
            $(window).scrollTop(0);
            $left.css({
                position: "fixed",
                left: "-100%",
                top: scrollY,
                width: "90%"
            });
            $right.css({
                width: "auto"
            });
            $("body").css({
                overflowX: "auto"
            });
            $left.unwrap();
        });
    }

    function slideLeft(){
        var rightOffset = $right.offset();
        $left.wrap('<div class="slider"/>').parent().append($right);
        $slider = $(".slider");

        $left.css({
            width: $right.width(),
            float: "left",
            position: "static"
        });
        $right.css({
            width: $right.width(),
            position: "relative",
            top: -scrollYLeft,
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

        $slider.animate({
            marginLeft: "0"
        }, 1000, function(){
            $right.css({
                position: "fixed",
                left: "100%",
                width: "90%",
                top: 0,
                paddingTop:0
            });
            $left.css({
                width: "auto"
            });
            $("body").css({
                overflowX: "auto"
            });
            $left.unwrap();
        });
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
