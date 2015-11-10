// 沒有卷軸時不出現 goTop 按鈕
$(window).scroll(function(){
     if ($(this).scrollTop() > 100) {
          $('.goTop').fadeIn();
     } else {
          $('.goTop').fadeOut();
     }
});

// 點選後跳到 href 指向的位置
$('.goTop').click(function () {
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 750);
    return false;
});

// 行動裝置的主選單
$(document).ready(function() {
    $menuLeft = $('#menu');
    $trigger = $('.menu-trigger');

    $trigger.click(function() {
        $(this).toggleClass('active');
        $('body').toggleClass('pushmenu-push');
        $menuLeft.toggleClass('pushmenu-open');
    });
});
