"use strict";

require.config({
  paths: {
    "bscroll": "./libs/better-scroll",
    "muimin": "./libs/mui.min",
    "jquery": "./libs/jq",
    "picker": "./libs/mui.picker.min",
    "swiper": "./libs/swiper"
  },
  shim: {
    "picker": {
      deps: ["muimin"]
    }
  }
});