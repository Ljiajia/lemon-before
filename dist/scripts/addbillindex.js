"use strict";

require(["./addbillconfig"], function () {
  require(["mui", "swiper"], function (mui, swiper) {
    var sswiper = new swiper("#swiper");
    var swipertwo = new swiper("#swipertwo");
    tab();

    function tab() {
      var headullist = document.querySelector(".headullist");
      var sectionullist = document.querySelector(".section-ullist");
      var tabs_li = headullist.children;
      var section_li = sectionullist.children;
      console.log(headullist);

      var _loop = function _loop(i) {
        tabs_li[i].onclick = function () {
          for (var j = 0; j < tabs_li.length; j++) {
            section_li[j].style.display = "none";
            tabs_li[j].classList.remove("cur");
          }

          section_li[i].style.display = "block";
          tabs_li[i].classList.add("cur");
        };
      };

      for (var i = 0; i < tabs_li.length; i++) {
        _loop(i);
      }
    }
  });
});