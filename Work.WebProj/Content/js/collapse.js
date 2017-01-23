var $collapse = $(".collapse dt");
var fall = '.collapse dd';

$(fall).css({display:"none"});

$collapse.click(function () {
    $(this).next(fall).slideToggle("fast");
    // $(this).parent().siblings().children().next().slideUp(150);
    $(this).siblings().next(fall).slideUp("fast");
    $(this).toggleClass("current"),
            $collapse.not(this).removeClass("current");
    return false;
});
