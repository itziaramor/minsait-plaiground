jQuery(document).ready(function () {
  var isDesktop;
  var isMobile;

  function init() {
    isDesktop = $(document).width() >= 992;
    isMobile = $(document).width() <= 575;

    if (isMobile) {
    }

    onTeamCarousel();
    onShowcaseCarousel();
  }

  function onTeamCarousel() {
    $(".js-team-carousel").slick({
      dots: true,
      arrows: false,
      speed: 500,
      infinite: false,
      adaptiveHeight: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      mobileFirst: true,
      responsive: [
        {
          breakpoint: 920,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 560,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ],
    });
  }

  function onShowcaseCarousel() {
    $(".js-showcase-carousel").slick({
      dots: false,
      arrows: false,
    });

    $(".js-showcase-news").slick({
      dots: true,
      arrows: false,
      speed: 300,
      autoplay: true,
      autoplaySpeed: 8000,
      pauseOnHover: false,
      fade: false,
      cssEase: "linear",
      infinite: false,
      slidesToShow: 1,
      adaptiveHeight: true,
    });

    $(".js-showcase-news").on("beforeChange", function (
      event,
      slick,
      currentSlide,
      nextSlide
    ) {
      // console.log(nextSlide);
      var srcWhite = "img/icon/plaiground.svg";
      var srcDark = "img/icon/plaiground-black.svg";
      if (nextSlide == 2) {
        $(".header").addClass("dark");
        $(".header__logo img").attr("src", srcDark);

        if ($(".header").hasClass("fix")) {
          $(".header__logo img").attr("src", srcDark);
        }
      } else {
        $(".header").removeClass("dark");
        $(".header__logo img").attr("src", srcWhite);

        if ($(".header").hasClass("fix")) {
          $(".header__logo img").attr("src", srcDark);
        }
      }
    });
  }

  init();
});
