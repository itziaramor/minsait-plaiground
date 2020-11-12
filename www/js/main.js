jQuery(document).ready(function () {
  var isDesktop;
  var isMobile;

  function init() {
    isDesktop = $(document).width() >= 992;
    isMobile = $(document).width() <= 575;

    smoothScroll();
    onAccordion();
    //onLoadVideo();
  }

  function onLoadVideo() {
    $(window).on("load resize", function () {
      var srcCarouselDesktop = "img/video/VideoCarrusel-1200.mp4";
      var srcCarouselTablet = "img/video/VideoCarrusel-768.mp4";
      var srcCarouselMobile = "img/video/VideoCarrusel-576.mp4";
      var videoCarousel = $(".video-carousel");
      var videoCarouselSource = $(".video-carousel source");
      var videoValues = $(".video-values");
      var videoValuesSource = $(".video-values source");
      var srcValuesDesktop = "img/video/values-1200.mp4";
      var srcValuesTablet = "img/video/values-768.mp4";
      var srcValuesMobile = "img/video/values-576.mp4";

      if ($(document).width() <= 575) {
        // carousel
        videoCarouselSource.attr("src", srcCarouselMobile);
        videoCarousel[0].load();
        // values
        videoValuesSource.attr("src", srcValuesMobile);
        videoValues[0].load();
      } else if ($(document).width() <= 1023) {
        // carousel
        videoCarouselSource.attr("src", srcCarouselTablet);
        videoCarousel[0].load();
        // values
        videoValuesSource.attr("src", srcValuesTablet);
        videoValues[0].load();
      } else {
        // carousel
        videoCarouselSource.attr("src", srcCarouselDesktop);
        videoCarousel[0].load();
        // values
        videoValuesSource.attr("src", srcValuesDesktop);
        videoValues[0].load();
      }
    });
  }

  function smoothScroll() {
    $(function () {
      $(".btn-anchor").click(function () {
        if (
          location.pathname.replace(/^\//, "") ==
            this.pathname.replace(/^\//, "") &&
          location.hostname == this.hostname
        ) {
          var target = $(this.hash);
          target = target.length
            ? target
            : $("[name=" + this.hash.slice(1) + "]");
          if (target.length) {
            $("html,body").animate(
              {
                scrollTop: target.offset().top - 125, //offsets for fixed header
              },
              1000
            );
            // remove fix class
            $(".header:not(.noscroll)").removeClass("fix");
            return false;
          }
        }
      });
      //Executed on page load with URL containing an anchor tag.
      if ($(location.href.split("#")[1])) {
        var target = $("#" + location.href.split("#")[1]);
        if (target.length) {
          $("html,body").animate(
            {
              scrollTop: target.offset().top - 125, //offset height of header here too.
            },
            1000
          );
          return false;
        }
      }
    });
  }

  function onAccordion() {
    var $headers = $(".js-values-title");

    $headers.on("click", function () {
      if ($(this).parents(".values__col").hasClass("open-block")) {
        $(this).parents(".values__col").removeClass("open-block");
        $(this).attr("aria-expanded", "false");
        $(this).parent().next(".js-values-description").slideUp();
        return;
      }
      $(this)
        .parents(".values__col")
        .siblings()
        .find($headers)
        .attr("aria-expanded", "false");
      $(this).parents(".values__col").siblings().removeClass("open-block");
      $(this).parents(".values__col").toggleClass("open-block");
      $(this).attr("aria-expanded", "true");
      $headers.parent().next(".js-values-description").slideUp();
      $(this).parent().next(".js-values-description").slideToggle();
    });
  }

  init();
});
