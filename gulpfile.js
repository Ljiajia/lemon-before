var gulp = require("gulp");
var sass = require("gulp-sass"); //编译sass
var cleanCss = require("gulp-clean-css"); //压缩css
var server = require("gulp-webserver"); //搭建服务
var htmlmin = require("gulp-htmlmin"); //压缩html
var babel = require("gulp-babel");
var uglify = require("gulp-uglify"); //压缩js

gulp.task("sass", function() {
    return gulp.src(["./src/scss/style.scss", "./src/scss/addbill.scss"])
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(gulp.dest("./dist/css/"))
})
gulp.task("server", function() {
    return gulp.src("./dist/")
        .pipe(server({
            port: 9093,
            open: true,
            livereload: true,
            proxies: [{
                source: "/bill/api/getbill",
                target: "http://localhost:3000/bill/api/getbill"
            }, {
                source: "/bill/api/removebill",
                target: "http://localhost:3000/bill/api/removebill"
            }]
        }))
})
gulp.task("html", function() {
    return gulp.src("./src/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./dist/"))
})
gulp.task("js", function() {
    return gulp.src("./src/scripts/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // .pipe(uglify())
        .pipe(gulp.dest("./dist/scripts/"))
})
gulp.task("watch", function() {
    gulp.watch("./src/", gulp.parallel("sass", "html", "js"))
})
gulp.task("default", gulp.series("sass", "html", "js", "server", "watch"))