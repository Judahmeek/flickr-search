$(document).on "ready page:load", ->
  $('#masonry-container').imagesLoaded ->
    $('#masonry-container').masonry
      itemSelector: '.masonry-brick',
      columnWidth: 320,
      isAnimated: !Modernizr.csstransitions,
      isFitWidth: true