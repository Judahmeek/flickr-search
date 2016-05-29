$(document).on "ready page:load", ->
  $('#masonry-container').imagesLoaded ->
    $('#masonry-container').masonry
      itemSelector: '.masonry-brick',
      columnWidth: 320,
      isAnimated: !Modernizr.csstransitions,
      isFitWidth: true

$(window).scroll(function (event) {
      var url = $('.btn-load-more').attr('href');
      var scroll = $(window).scrollTop() + $(window).height() - 200;
      var position = buyersWall.position().top + buyersWall.height();

      if (url && scroll > position && tempNum <= 2) {
        $('.load-more-container').html('<div class="text-center"><i class="fa fa-spinner fa-spin text-primary" style="font-size: 300px;"></i></div>')
        page += 1;
        tempNum += 1;
        $.getScript(url);
      }
    });