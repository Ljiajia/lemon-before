require.config({
    paths: {
        "bscroll": "./libs/better-scroll",
        "muimin": "./libs/mui.min",
        "jquery": "./libs/jq",
        "picker": "./libs/mui.picker.min"
    },
    shim: {
        "picker": { deps: ["muimin"] }
    }
})