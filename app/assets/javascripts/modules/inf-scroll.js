$(document).on("ready page:load", function() {
  var container = $('#masonry-container');
  if(container.length > 0) {
    ( function() {
    		window.ScrollMore = window.ScrollMore || {
    			// Basic variables
    			opts : {
    				nextUrl : "",
    				triggerDistance : $(window).height()
    			},
    
    			// Use internally, to prevent next URL is loaded multiple times
    			_blockUrls : {},
    
    			// Check if user scroll near bottom
    			// Taken from http://stackoverflow.com/questions/3898130/how-to-check-if-a-user-has-scrolled-to-the-bottom
    			isNearTarget : function(container) {
    			  return $(window).scrollTop() + $(window).height() + this.opts.triggerDistance > container.position().top + container.height();
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
    				  if(data){
    					success(data);
    				  } else {
    				    this.stop();
    				    $('#infscroll-trigger').html('<p>All relevant results shown</p><button id="action_call" href="../../home">Want to try a new search?</button>');
    				  }
    				}).fail(function(jqXHR, textStatus) {
    					error(jqXHR, textStatus);
    					this.stop();
    				});
    			},
    
    			// Initialize the scroll with callback functions
    			// Adopt pattern from http://ejohn.org/blog/learning-from-twitter/ to prevent slow performance with scroll event
    			init : function(container, before, success, error) {
    				var didScroll = false;
    				$(window).scroll(function() {
    					didScroll = true;
    				});
    
    				var $this = this;
    				this.poll = setInterval(function() {
    					if (didScroll) {
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
    				}, 250);
    			},
    			
    			stop : function(){
    			  if(this.poll){
    			    clearInterval(this.poll);
    			    this.poll = null;
    			  }
    			  this.init = null;
    			},
    			
    			poll : null
    		};
    	}());
  
    var trigger = $('#infscroll-trigger');
    var ScrollMore = window.ScrollMore;
    // Setup ScrollMore
    ScrollMore.opts.nextUrl = trigger.attr('href');
    // You can edit distance to bottom before load. Default value is 100px.
    ScrollMore.opts.distanceToBottom = 100;
    
    var before = function(xhr) {
        trigger.html('<img id="index_spinner" src="https://i.imgur.com/6RMhx.gif" title="Loading..."></img>');
    };
    
    // data is the content of the next url loaded
    var success = function(newElements) {
      trigger.html("");
      // hide new items while they are loading
      var $newElems = $( newElements ).css({ opacity: 0 });
      container.append($newElems);
      // ensure that images load before adding to masonry layout
      $newElems.imagesLoaded(function(){
        // show elems now they're ready
        $newElems.animate({ opacity: 1 });
        container.masonry( 'appended', $newElems, true );
      });
  
      // Update next url. ScrollMore will load this nextUrl when user continues scrolling to bottom.
      // To stop, just set ScrollMore.opts.nextUrl = undefined;
      var last = ScrollMore.opts.nextUrl.length - 1;
      ScrollMore.opts.nextUrl = ScrollMore.opts.nextUrl.slice(0, last) + (parseInt(ScrollMore.opts.nextUrl[last]) + 1);
    };
    
    var error = function() {
        trigger.html("Something went wrong with get request: " + ScrollMore.opts.nextUrl);
    };
    
    ScrollMore.init(container, before, success, error);
  }
});