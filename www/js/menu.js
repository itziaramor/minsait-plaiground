jQuery(document).ready(function () {
  var isDesktop;
  var isMobile;

  function init() {
    isDesktop = $(document).width() >= 992;
    isMobile = $(document).width() <= 575;

    if(isMobile) {
      onBurgerMenu();
      onCloseMenu();
      anchorMenu();
    } else {
      anchorMenuDesktop();
    }

    onFixHeader();
  }

  function onFixHeader() {
    $(window).scroll(function () {
      var scroll = $(window).scrollTop();
      var srcWhite = 'img/icon/plaiground.svg';
      var srcDark = 'img/icon/plaiground-black.svg';
      if (scroll > 0) {

        $('.header:not(.noscroll)').addClass('fix');

        if($('.header:not(.noscroll)').hasClass('fix')) {
          $('.header__logo img').attr('src', srcDark);
        }

        if($('.header:not(.noscroll)').hasClass('dark')) {
          $('.header__logo img').attr('src', srcDark);
        }
      } else {
        $('.header:not(.noscroll)').removeClass('fix');

        $('.header__logo img').attr('src', srcWhite);

        if($('.header:not(.noscroll)').hasClass('dark')) {
          $('.header__logo img').attr('src', srcDark);
        }
      }
    });
  }

  function onBurgerMenu() {
    $('.js-menu').on('click', function (e) {
      if(e) {e.preventDefault();}

      // $(this).toggleClass('is-open');
      $(this).parents('.header').find('.navbar').addClass('is-open');
      $(this).attr('aria-expanded','true');
      $(this).parents('.header').removeClass('fix');

      if ( $('.navbar').hasClass('is-open') ) {
        $('body').addClass('overflow');
        $('header').addClass('veil noscroll');
      } else {
        $('body').removeClass('overflow');
        $('header').removeClass('veil noscroll');
      }
    });
  }

  function anchorMenuDesktop() {
    $('.navbar__list .btn-anchor').on('click', function (e) {
      if(e) {e.preventDefault();}
      $('.navbar__list').addClass('is-scrolling');
      $(e.target).addClass('is-current-target');
    });
  }

  function anchorMenu() {
    $('.navbar__list .btn-anchor').on('click', function (e) {
      if(e) {e.preventDefault();}

      // close menu
      $(this).parents('.navbar').removeClass('is-open');
      $('body').removeClass('overflow');
      $('header').removeClass('veil noscroll');
      $('.js-menu').attr('aria-expanded','false');
    });
  }

  function onCloseMenu() {
    $('.js-close').on('click', function (e) {
      if(e) {e.preventDefault();}

      $(this).parent('.navbar').removeClass('is-open');
      $('body').removeClass('overflow');
      $('header').removeClass('veil noscroll');
      $('.js-menu').attr('aria-expanded','false');
    });
  }

  init();
});

window.onload = function() {
  this.setTimeout(function() {
    var $menuItems = $('.navbar__list .btn-anchor');
    var $sections = $('section');
    var sectionPositions = [];
    var scrollPosition;
    var windowHeight;
    var sectionLimit;
    var documentHeight;

    function highlightMenuItem(item) {
      $menuItems.removeClass('is-active');
      $menuItems.eq(item).addClass('is-active');
    }

    function highlightCurrentSection() {
      scrollPosition = $(window).scrollTop();

      if (scrollPosition < sectionPositions[1] - sectionLimit) {
        highlightMenuItem(0);
      } else if (scrollPosition < sectionPositions[2] - sectionLimit) {
        highlightMenuItem(1);
      } else if (scrollPosition < sectionPositions[3] - sectionLimit) {
        highlightMenuItem(2);
      } else if (scrollPosition + windowHeight < (documentHeight - 200)) {
        highlightMenuItem(3);
      } else {
        highlightMenuItem(4);
      }
    }

    function listenScroll(e) {
      sectionPositions = [];
      $(window).off('scroll', window, highlightCurrentSection);

      $.each($sections, function (i, e) {
        sectionPositions.push($(this).offset().top);
      });

      windowHeight = $(window).height();
      sectionLimit = windowHeight / 3;
      documentHeight = $(document).height();

      highlightCurrentSection();
      $(window).scroll(highlightCurrentSection);
    }

    listenScroll();

    var resizeTimer;
    $(window).on('resize', function (e) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        listenScroll(e);
      }, 250);
    });

    var isScrolling;
    window.addEventListener('scroll', function (event) {
      window.clearTimeout(isScrolling);

      isScrolling = setTimeout(function () {
        if ($('.navbar__list').hasClass('is-scrolling')) {
          $('.navbar__list').removeClass('is-scrolling');
          $('.navbar__list .btn-anchor').removeClass('is-current-target');
        }
      }, 66);
    }, false);
  }, 0);
}
