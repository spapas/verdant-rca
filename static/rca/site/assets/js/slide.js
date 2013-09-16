$(function(){
    function pixelToNumber(val){
        return parseInt(("" + val).replace(/[\-px]+/g, ""), 10);
    }
    var $slider = $(".slider");
    var $left = $(".wrapper-left");
    var $right = $(".wrapper-right");
    var scrollY;

    // $left.css("border", "1px solid black");
    // $right.css("border", "1px solid red");

    var headerFullHeight = $(".header-wrapper").height();

    $left.find(".two-plus a").click(function(){
        var leftOffset = $left.offset();
        var leftMarginTop = pixelToNumber($left.css("margin-top"));
        var leftWidht = $left.width();
        var leftHeight = $left.height();
        scrollY = window.scrollY;

        $slider.css({
            height: leftHeight
        });

        $left.css({
            position: "fixed",
            top: - scrollY + leftOffset.top - leftMarginTop,
            left: leftOffset.left,
            width: leftWidht
        });

        $left.animate({
            left: -leftWidht,
            marginLeft: "2.5%"
        }, 1000);

        $right.css({
            position: "fixed",
            top: headerFullHeight,
            width: leftWidht
        });
        $right.animate({
            left: 0,
            marginLeft: "5%"
        }, 1000, function(){
            $right.css({
                position: "static",
                width: "90%"
            });
        });

    });

    $right.find(".two-plus a").click(function(){
        var offset = $right.offset();
        var marginTop = pixelToNumber($right.css("margin-top"));
        var width = $right.width();

        $left.animate({
            left: 0,
            marginLeft: "5%"
        }, 1000, function(){
            $left.css({
                position: "static"
            });
            $(window).scrollTop(scrollY);
        });


        $right.css({
            position: "fixed",
            top: -window.scrollY + offset.top - marginTop,
            width: width,
            marginLeft: "10%"
        });
        $right.animate({
            left: width
        }, 1000, function(){
            $left.css({
                width: "90%"
            });
        });

    });
});
