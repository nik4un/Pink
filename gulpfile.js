"use strict";

var gulp = require("gulp"),

    server = require("browser-sync"),
    rename = require("gulp-rename"),
    run = require("run-sequence"),
    del = require("del"),

    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    minify = require("gulp-csso"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    mqpacker = require("css-mqpacker"),

    imagemin = require("gulp-imagemin"),
    svgo = require('gulp-svgmin'),

    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

gulp.task("style", function () {
    gulp.src("sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    "last 1 version",
                    "last 2 Chrome versions",
                    "last 2 Firefox versions",
                    "last 2 Opera versions",
                    "last 2 Edge versions"
                ]
            })
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.reload({stream: true}));
});

gulp.task("scripts", function () {
    gulp.src([
            "js/plugins/picturefill.min.js",
            "js/common.js",
            "js/minislider.js",
            "js/menu.js",
            "js/map.js",
            "js/app.js"
        ])
        .pipe(concat("script.js"))
        .pipe(gulp.dest("build/js"))
        .pipe(rename("script.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/js"))
        .pipe(server.reload({stream: true}));
});

gulp.task("raster", function () {
    gulp.src([
            "img/**/*.{png,jpg,gif}"
        ])
        .pipe(imagemin([
            imagemin.optipng({
                optimizationLevel: 3
            }),
            imagemin.jpegtran({
                progressive: true
            })
        ]))
        .pipe(gulp.dest("build/img"))
});

gulp.task("vector", function () {
    gulp.src([
            "img/**/*.svg"
        ])
        .pipe(svgo())
        .pipe(gulp.dest('build/img'));
});

gulp.task("images", function (fn) {
    run(
        "raster",
        "vector",
        fn
    );
});

gulp.task("serve", function () {
    server.init({
        server: "build",
        notify: true,
        open: true,
        ui: false
    });

    gulp.watch("sass/**/*.{scss,sass}", ["style"]);
    gulp.watch("js/**/*.js", ["scripts"]);
    gulp.watch("*.html", ["copy"]);
});

gulp.task("copy", function () {
    gulp.src([
            "fonts/**/*.{woff,woff2}",
            "*.html"
        ], {
            base: "."
        })
        .pipe(gulp.dest("build"))
        .pipe(server.reload({stream: true}));
});

gulp.task("clean", function () {
    del("build");
});

gulp.task("build", function (fn) {
    run(
        "clean",
        "copy",
        "style",
        "scripts",
        "images",
        fn
    );
});
