//auto advance carousel
!function ($) {
  $(function(){
  // carousel demo
  $('#myCarousel').carousel({  
    interval: 15000 // in milliseconds  
  })
  })
}(window.jQuery)

//carousel selectors NOT DRY :(
$('#carousel-jump1').click(function() {
	$('#carousel2').removeClass('active');
	$('#carousel1').addClass('active');
	
	var dimensionValue = 'Water map';
	ga('set', 'dimension1', dimensionValue);
});
$('#carousel-jump2').click(function() {
	$('#carousel1').removeClass('active');
	$('#carousel2').addClass('active');
	
	
	var dimensionValue = 'Food map';
	ga('set', 'dimension1', dimensionValue);
});



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

