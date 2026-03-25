jQuery(document).ready(function ($) {
  var lastScrollTop = 0;
  var header = $(".nav-wrapper");

  $(window).on("scroll", function () {
    var st = $(this).scrollTop();
    if (st > lastScrollTop) {
      header.stop(true, true).slideUp(180);
    } else {
      header.stop(true, true).slideDown(180);
    }
    lastScrollTop = st;
  });
});
