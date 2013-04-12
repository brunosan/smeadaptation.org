//auto advance carousel
!function ($) {
  $(function(){
  // carousel demo
  $('#myCarousel').carousel({  
    interval: 5000 // in milliseconds  
  })
  })
}(window.jQuery)

//stop for now


//Ease link scrolling to anchor
var $root = $('html, body');
$('a').click(function() {
    var href = $.attr(this, 'href');
    $root.animate({
        scrollTop: $(href).offset().top
    }, 500, function () {
        window.location.hash = href;
    });
    return false;
});