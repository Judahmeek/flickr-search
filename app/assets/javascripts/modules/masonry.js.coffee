$(document).on "ready page:load", ->
  container = $('#masonry-container')
  if container.length > 0
    container.imagesLoaded ->
      container.masonry
        itemSelector: '.masonry-brick',
        columnWidth: 320,
        isAnimated: !Modernizr.csstransitions,
        isFitWidth: true