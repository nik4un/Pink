"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");
var imagemin = require("gulp-imagemin");
var uglify = require("gulp-uglify");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var mqpacker = require("css-mqpacker");

gulp.task("build", function(fn) {
    run("clean", "copy", "style", "images", fn);
});

gulp.task("clean", function() {
    return del("build");
});

gulp.task("copy", function() {
    return gulp.src([
            "fonts/**/*.{woff,woff2}",
            "img/**",
            "js/**",
            "*.html"
        ], {
            base: "."
        })
        .pipe(gulp.dest("build"));
});

gulp.task("style", function() {
    gulp.src("less/style.less")
        .pipe(plumber())
        .pipe(less(
            mqpacker({
                sort: true
            })
        ))
        .pipe(postcss([
            autoprefixer({
                browsers: ["last 2 versions"]
            })
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream())
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"));
});

gulp.task("images", function() {
    return gulp.src("build/img/**/*.{png,jpg,gif}")
        .pipe(imagemin([
            imagemin.optipng({
                optimizationLevel: 3
            }),
            imagemin.jpegtran({
                progressive: true
            })
        ]))
        .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function() {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.task("html:copy", function() {
        return gulp.src("*.html")
            .pipe(gulp.dest("build"));
    });

    gulp.task("html:update", ["html:copy"], function(done) {
        server.reload();
        done();
    });

    gulp.watch("less/**/*.less", ["style"]);
    gulp.watch("img/*.svg").on("change", server.reload);
    gulp.watch("*.html", ["html:update"]);
});
