"use strict";

const gulp = require("gulp");
const less = require("gulp-less");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const minify = require("gulp-csso");
const rename = require("gulp-rename");
const del = require("del");
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const run = require("run-sequence");
const mqpacker = require("css-mqpacker");

gulp.task("build", function(fn) {
    run("clean", "copy", "style", "images", "jscript", "pixel-glass", fn);
});

gulp.task("clean", function() {
    return del("build");
});

gulp.task("copy", function() {
    return gulp.src([
            "fonts/**/*.{woff,woff2}",
            "img/**",
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

gulp.task("jscript", function () {
  gulp.src("js/*.js")
   .pipe(gulp.dest("build/js"))
   .pipe(server.stream())
   .pipe(uglify())
   .pipe(rename({suffix: ".min"}))
   .pipe(gulp.dest("build/js"));
});

gulp.task("pixel-glass", function() {
    return gulp.src([
            "node_modules/pixel-glass/*.js",
            "node_modules/pixel-glass/*.css"
        ], {
            base: "."
        })
        .pipe(gulp.dest("build"));
});

gulp.task("server", function() {
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
    gulp.watch("build/css/*.css", ["html:update"]);
    gulp.watch("js/*.js", ["jscript"]);
    gulp.watch("build/js/*.js", ["html:update"]);
    gulp.watch("img/*.svg").on("change", server.reload);
    gulp.watch("*.html", ["html:update"]);
});
