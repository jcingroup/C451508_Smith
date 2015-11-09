$(".collapse dt").click(function() {
    $header = $(this);

    // 取得要收合的元素，緊臨 .collapse dt 旁(此元素須 display:none
    $content = $header.next();

    // 按下要顯示的元素後(其他的收合)
    if (!($content.is(":visible"))) {

        // 收合
        $(".collapse dd").slideUp("fast", function(){
            $(".collapse dt").removeClass('current');
        });

        // 開啟
        $content.slideToggle(300, function () {
            $header.addClass('current');
        });
    }
});
