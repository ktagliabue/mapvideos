function sliderLoad(){
  
  var slide = $('.li-slider').length;
  var slideWidth = $('.li-slider').width();
  var slideHeight = $('.li-slider').height();
  var sliderUlWidth = slide * slideWidth;

  $('#slider-container').css({ width: slideWidth, height: slideHeight });

  $('#ul-slider').css({ width: sliderUlWidth, marginLeft: - slideWidth });

  $('#ul-slider li:last-child').prependTo('#ul-slider');

  $('#infobubble-container').css({ visibility: 'visible' });

  function moveLeft() {
    $('#ul-slider').animate({
        left: + slideWidth
    }, 200, function () {
        $('#ul-slider li:last-child').prependTo('#ul-slider');
        $('#ul-slider').css('left', '');
        $("#navlist li:last").detach().insertBefore("#navlist li:first");
    });
  };

  window.moveLeft = moveLeft;

  function moveRight() {
    $('#ul-slider').animate({
        left: - slideWidth
    }, 200, function () {
        $('#ul-slider li:first-child').appendTo('#ul-slider');
        $('#ul-slider').css('left', '');
        $("#navlist li:first").detach().insertAfter("#navlist li:last");
    });
  };

  window.moveRight = moveRight;

}