(function () {
  'use strict';

  function toNumber(value, fallback) {
    var num = parseFloat(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function toBoolean(value) {
    return String(value).toLowerCase() === 'true';
  }

  function firstValue() {
    for (var i = 0; i < arguments.length; i += 1) {
      if (arguments[i] !== undefined && arguments[i] !== null && arguments[i] !== '') {
        return arguments[i];
      }
    }
    return undefined;
  }

  function collectSlides(swiperRoot) {
    var wrapper = swiperRoot.querySelector(':scope > .swiper-wrapper');
    if (wrapper) {
      return wrapper;
    }

    var postTemplate = swiperRoot.querySelector(':scope > ul.wp-block-post-template, :scope > .wp-block-post-template');
    if (postTemplate) {
      postTemplate.classList.add('swiper-wrapper');
      Array.prototype.forEach.call(postTemplate.children, function (child) {
        child.classList.add('swiper-slide');
      });
      return postTemplate;
    }

    var candidates = Array.prototype.filter.call(swiperRoot.children, function (child) {
      return child.tagName !== 'STYLE' && child.tagName !== 'SCRIPT' && !child.classList.contains('swiper-pagination') && !child.classList.contains('swiper-button-prev') && !child.classList.contains('swiper-button-next') && !child.classList.contains('swiper-scrollbar');
    });

    if (!candidates.length) {
      return null;
    }

    var generated = document.createElement('div');
    generated.className = 'swiper-wrapper';

    candidates.forEach(function (item) {
      item.classList.add('swiper-slide');
      generated.appendChild(item);
    });

    swiperRoot.insertBefore(generated, swiperRoot.firstChild);
    return generated;
  }

  function hasSlides(wrapper) {
    if (!wrapper) {
      return false;
    }

    var slides = wrapper.querySelectorAll(':scope > .swiper-slide');
    return slides.length > 0;
  }

  function buildConfig(initNode, sliderRoot) {
    var mobileBp = (window.gs_swiper_params && window.gs_swiper_params.breakpoints && window.gs_swiper_params.breakpoints.mobile) || 690;
    var desktopBp = (window.gs_swiper_params && window.gs_swiper_params.breakpoints && window.gs_swiper_params.breakpoints.desktop) || 1000;

    var ds = initNode.dataset || {};

    var slidesDesktop = toNumber(firstValue(ds.slidesperview, ds.slidesPerView), 1);
    var slidesTablet = toNumber(firstValue(ds.slidesperviewmd, ds.slidesPerViewMd, slidesDesktop), slidesDesktop);
    var slidesMobile = toNumber(firstValue(ds.slidesperviewsm, ds.slidesPerViewSm, slidesTablet), slidesTablet);
    var slidesXs = toNumber(firstValue(ds.slidesperviewxs, ds.slidesPerViewXs, slidesMobile), slidesMobile);

    var spaceDesktop = toNumber(firstValue(ds.spacebetween, ds.spaceBetween), 0);
    var spaceTablet = toNumber(firstValue(ds.spacebetweenmd, ds.spaceBetweenMd, spaceDesktop), spaceDesktop);
    var spaceMobile = toNumber(firstValue(ds.spacebetweensm, ds.spaceBetweenSm, spaceTablet), spaceTablet);
    var spaceXs = toNumber(firstValue(ds.spacebetweenxs, ds.spaceBetweenXs, spaceMobile), spaceMobile);

    var autoplayEnabled = toBoolean(ds.autoplay);

    return {
      speed: toNumber(ds.speed, 400),
      loop: toBoolean(ds.loop),
      autoHeight: toBoolean(ds.autoheight),
      grabCursor: toBoolean(ds.grabcursor),
      freeMode: toBoolean(ds.freemode),
      centeredSlides: toBoolean(ds.centered),
      direction: toBoolean(ds.vertical) ? 'vertical' : 'horizontal',
      slidesPerView: slidesDesktop,
      spaceBetween: spaceDesktop,
      autoplay: autoplayEnabled
        ? {
            delay: toNumber(ds.autodelay, 4000),
            disableOnInteraction: false,
          }
        : false,
      pagination: {
        el: sliderRoot.querySelector('.swiper-pagination'),
        clickable: true,
      },
      navigation: {
        nextEl: sliderRoot.querySelector('.swiper-button-next'),
        prevEl: sliderRoot.querySelector('.swiper-button-prev'),
      },
      scrollbar: {
        el: sliderRoot.querySelector('.swiper-scrollbar'),
        draggable: true,
      },
      breakpoints: (function () {
        var points = {};
        points[0] = { slidesPerView: slidesXs, spaceBetween: spaceXs };
        points[mobileBp] = { slidesPerView: slidesMobile, spaceBetween: spaceMobile };
        points[desktopBp] = { slidesPerView: slidesDesktop, spaceBetween: spaceDesktop };
        return points;
      })(),
    };
  }

  function initGreenshiftSwiper(scope) {
    if (typeof window.Swiper === 'undefined') {
      return;
    }

    var root = scope || document;
    var sliders = root.querySelectorAll('.gs-swiper');

    Array.prototype.forEach.call(sliders, function (sliderRoot) {
      if (sliderRoot.dataset.gsSwiperInitialized === 'true') {
        return;
      }

      var initNode = sliderRoot.querySelector('.gs-swiper-init');
      var swiperNode = sliderRoot.querySelector('.swiper');

      if (!initNode || !swiperNode) {
        return;
      }

      var wrapper = collectSlides(swiperNode);
      if (!hasSlides(wrapper)) {
        return;
      }

      try {
        var config = buildConfig(initNode, sliderRoot);
        var instance = new Swiper(swiperNode, config);
        sliderRoot.dataset.gsSwiperInitialized = 'true';
        sliderRoot.gsSwiperInstance = instance;
      } catch (err) {
        console.error('Greenshift swiper init failed:', err);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initGreenshiftSwiper(document);
    });
  } else {
    initGreenshiftSwiper(document);
  }

  document.addEventListener('jet-filter-content-rendered', function (event) {
    var target = event && event.target ? event.target : document;
    initGreenshiftSwiper(target);
  });

  window.initGreenshiftSwiper = initGreenshiftSwiper;
})();
