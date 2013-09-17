
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
    var $slider = $(".slider");
    var $left = $(".wrapper-left");
    var $right = $(".wrapper-right");
    var $header = $(".header-wrapper");
    var scrollY;

    // TODO: if content is not fully loaded the container might need to be taller
    // TODO: positioning if menu is not collapsed on the main page

    var headerFullHeight = $(".header-wrapper").height();
    var headerCompactHeight = 34;

    $(document).pjax('.wrapper-left a[data-pjax]', '.wrapper-right');

    $left.find(".two-plus a").click(function(){
        var leftAffix = $left.data('bs.affix');
        var rightAffix = $right.data('bs.affix');
        var headerAffix = $header.data('bs.affix');

        var leftOffset = $left.offset();
        var leftMarginTop = pixelToNumber($left.css("margin-top"));
        var leftWidht = $left.width();
        var leftHeight = $left.height();
        var leftFinished, rightFinished;
        scrollY = window.scrollY;

        $slider.css({
            height: leftHeight
        });

        $left.css({
            position: "fixed",
            top: - scrollY + leftOffset.top - leftMarginTop,
            left: leftOffset.left,
            width: leftWidht,
            marginLeft: 0
        });

        // make the top nav menu compact by scrolling down
        // $(window).scrollTop(1 + pixelToNumber($left.data("offset-top")));

        leftAffix.disable();
        rightAffix.disable();
        $right.removeClass(headerAffix.constructor.RESET);

        $left.animate({
            left: -leftWidht/2
        }, 1000, function(){
            leftFinished = true;
            checkBothAnimationsFinished();
        });

        $right.css({
            position: "fixed",
            top: leftOffset + leftMarginTop,
            width: leftWidht
        });

        headerAffix.disable();
        $header.removeClass(headerAffix.constructor.RESET).addClass("affix");

        $right.animate({
            left: 0,
            marginLeft: "5%"
        }, 1000, function(){
            $right.css({
                position: "static",
                width: "90%"
            });
            // $(window).scrollTop($left.data("offset-top"));
            rightAffix.enable();
            rightFinished = true;
            checkBothAnimationsFinished();
        });


        function checkBothAnimationsFinished(){
            if(leftFinished && rightFinished){
                headerAffix.enable();
            }
        }

    });

    $right.on("click", "a", function(){
        window.history.pushState(null, "", "programme.html");

        var leftAffix = $left.data('bs.affix');
        var rightAffix = $right.data('bs.affix');
        var headerAffix = $header.data('bs.affix');

        var offset = $right.offset();
        var marginTop = pixelToNumber($right.css("margin-top"));
        var width = $right.width();
        var leftFinished, rightFinished;

        headerAffix.disable();
        $header.removeClass(headerAffix.constructor.RESET).addClass("affix");

        $left.animate({
            left: 0,
            marginLeft: "5%"
        }, 1000, function(){
            $(window).scrollTop(scrollY);
            $left.css({
                position: "static"
            });
            $(window).scrollTop(scrollY);

            leftAffix.enable();
            leftFinished = true;
            checkBothAnimationsFinished();
        });

        $right.css({
            position: "fixed",
            top: -window.scrollY + offset.top - marginTop,
            left: offset.left,
            width: width,
            marginLeft: 0
        });

        $right.animate({
            left: width
        }, 1000, function(){
            $left.css({
                width: "90%"
            });
            rightAffix.disable();
            rightFinished = true;
            checkBothAnimationsFinished();
        });

        function checkBothAnimationsFinished(){
            if(leftFinished && rightFinished){
                headerAffix.enable();
            }
        }
        return false;
    });
});
