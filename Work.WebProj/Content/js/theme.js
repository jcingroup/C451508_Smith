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
$(".menu-trigger").click(function (event){
    $("body").toggleClass("toggled");
    event.preventDefault();
});

// 行動裝置的產品左選單
$(".submenu-trigger .btn").click(function (event){
    $("#sidebar").slideToggle();
    event.preventDefault();
});

