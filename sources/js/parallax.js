// Grab all the red boxes
var section = document.querySelector("section");
var divs = document.querySelectorAll("section div");

// Trun the result into a legit JS array
divs = Array.prototype.slice.call(divs, 0);

// Extract the paralax speed into a property for later use
divs.forEach(function(d) {
    d.paralaxSpeed = d.getAttribute("data-paralax-speed");
});

// Check how much we can scroll. This value is the
// height of the scrollable element minus the height of the widow
var sectionHeight = section.getBoundingClientRect().height - window.innerHeight;

// Add easing to the scroll. Play with this value to find a setting that you like.
// var ease = 0.3;
var ease = 0.09;

// Store current scroll position
var targetX = 0, targetY = 0;
var currentX = 0, currentY = 0;

// Use this if you want to lock the elastic overscroll on mobile
document.addEventListener('touchmove', function(e) { e.preventDefault(); });

// Add virtual scroll listener
VirtualScroll.on(function(e) {

    // Accumulate delta value on each scroll event
    targetY += e.deltaY;
    targetX += e.deltaX;

    // Clamp the value so it doesn't go too far up or down
    // The value needs to be between 0 and -sectionHeight
    targetY = Math.max(-sectionHeight, targetY);
    targetY = Math.min(0, targetY);

});

var scroll = function() {
    // Make sure this works across different browsers (use the shim or something)
    requestAnimationFrame(scroll);

    // Get closer to the target value at each frame, using ease.
    // Other easing methods are also ok.
    currentY += (targetY - currentY) * ease;

    // Uncomment this line to scroll horizontally
    // currentX += (targetX - currentX) * ease;

    // Run on every box, multiplying it by the paralax speed for each
    divs.forEach(function(d) {

        var p = d.paralaxSpeed;

        // Create the CSS transform string
        // (alternativly: use WebKitCSSMatrix, though it doesn't see any faster (http://jsperf.com/webkitcssmatrix-vs-translate3d)
        var v1 = "translateX(" + (currentX*p) + "px) translateY(" + (currentY*p) + "px)";// translateZ(0)";
        var v2 = "translateX(" + (currentX*p) + "px) translateY(" + (currentY*p) + "px)";// translateZ(0)";

        // Apply CSS style
        d.style['webkitTransform'] = v1;
        d.style['msTransform'] = v1;
        d.style.transform = v1;
    });
}

// Start the rendering loop function
scroll();
