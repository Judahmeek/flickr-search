( function() {
		window.ScrollMore = window.ScrollMore || {
			// Basic variables
			opts : {
				nextUrl : "",
				triggerDistance : 200,
			},

			// Use internally, to prevent next URL is loaded multiple times
			_blockUrls : {},

			// Check if user scroll near bottom
			// Taken from http://stackoverflow.com/questions/3898130/how-to-check-if-a-user-has-scrolled-to-the-bottom
			isNearTarget : function(container) {
			  return $(window).scrollTop() + $(window).height() > container.position().top + container.height() + this.opts.triggerDistance;
			},

			// Do AJAX GET for the nextUrl, with callback before, success and error
			// Simply jQuery Ajax here
			get : function(before, success, error) {
				var $this = this;
				$.ajax({
					type : "GET",
					url : $this.opts.nextUrl,
					beforeSend : function(xhr) {
						before(xhr);
					}
				}).done(function(data) {
					success(data);
				}).fail(function(jqXHR, textStatus) {
					error(jqXHR, textStatus);
				});
			},

			// Initialize the scroll with callback functions
			// Adopt pattern from http://ejohn.org/blog/learning-from-twitter/ to prevent slow performance with scroll event
			init : function(container, before, success, error) {
			  console.log("Init begun!");
				var didScroll = false;
				$(window).scroll(function() {
					didScroll = true;
				});

				var $this = this;
				setInterval(function() {
					if (didScroll) {
					  console.log("Caught you scrolling!");
						didScroll = false;
						if ($this.isNearTarget(container)) {
							if ($this.opts.nextUrl !== "" && $this.opts.nextUrl !== undefined) {
								// If the next url is already loaded, it will not be loaded when user continues scrolling
								if (($this.opts.nextUrl in $this._blockUrls) == false) {
									$this.get(before, success, error);
									$this._blockUrls[$this.opts.nextUrl] = true;
								}
							}
						}
					}
				}, 500);
			}
		};
	}());

$(document).on("ready page:load", function() {
  console.log("inf-scroll script runs at least.");
  var trigger = $('#infscroll-trigger');
  var ScrollMore = window.ScrollMore;
  // Setup ScrollMore
  ScrollMore.opts.nextUrl = trigger.attr('href');
  // You can edit distance to bottom before load. Default value is 100px.
  ScrollMore.opts.distanceToBottom = 100;
  
  var before = function(xhr) {
      trigger.html('<img src="http://i.imgur.com/6RMhx.gif" title="Loading..."></img>');
      // Show loading here;
      console.log("Before Send");
  };
  
  // data is the content of the next url loaded
  var success = function(newElements) {
      console.log("great success with get request: " + ScrollMore.opts.nextUrl + '!');
      console.log(newElements);
      // hide new items while they are loading
      var $newElems = $( newElements ).css({ opacity: 0 });
      // ensure that images load before adding to masonry layout
      $newElems.imagesLoaded(function(){
        // show elems now they're ready
        $newElems.animate({ opacity: 1 });
        $("#masonry-container").append(newElements).masonry( 'appended', $newElems, true );
      });
  
      // Update next url. ScrollMore will load this nextUrl when user continues scrolling to bottom.
      // To stop, just set ScrollMore.opts.nextUrl = undefined;
      var last = ScrollMore.opts.nextUrllength - 1;
      ScrollMore.opts.nextUrl = ScrollMore.opts.nextUrl.slice(0, last) + (parseInt(ScrollMore.opts.nextUrl[last]) + 1);
  };
  var error = function() {
      trigger.html("Something went wrong with get request: " + ScrollMore.opts.nextUrl);
  };
  
  ScrollMore.get(before, success, error); //initial request
  ScrollMore.init(before, success, error);
});