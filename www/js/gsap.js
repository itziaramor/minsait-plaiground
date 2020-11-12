$(function() {
  var controller = new ScrollMagic.Controller({
    //to get on the fly updates from a mobile browser, the controller needs
    //to be attached to a container with overflow: scroll enabled
    container: '#scroll-container'
    
    //these scene option apply to all scenes attached to this controller
    //note that for the purposes of experimentation, these have been added to
    //each scene individually
   // globalSceneOptions: {triggerHook: "onEnter", duration: "200%"}
  });
  
  var scene = new ScrollMagic.Scene({
    triggerElement: '#p1',
    duration: "200%",
    triggerHook: 1   
  })
  .setTween('#p1 > div', {y: "80%", ease: Linear.easeNone})
  .addTo(controller);
})