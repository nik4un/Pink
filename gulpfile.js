'use strict';

const { src, dest, series, watch } = require('gulp');
const del = require('del'); // Delete files and directories using globs
const plumber = require('gulp-plumber'); // Prevent pipe breaking caused by errors from gulp plugins
const sourcemap = require('gulp-sourcemaps'); // Write inline source maps
const sass = require('gulp-sass'); // A SASS plugin for Gulp
const postcss = require('gulp-postcss'); // pipe CSS through several plugins, but parse CSS only once
const autoprefixer = require('autoprefixer'); // parse CSS and add vendor prefixes to CSS rules
const svgSprite = require('gulp-svg-sprite'); // Combine svg files into one
const rename = require('gulp-rename'); // rename files
const browserSync = require('browser-sync').create(); // http server with auto reload
const minifyCSS = require('gulp-csso'); // minify CSS
const minifyJS = require('gulp-uglify'); // minify JavaScript
const minifyHTML = require('gulp-htmlmin'); // minify HTML
const include = require('posthtml-include'); // include fragments of html code
const posthtml = require('gulp-posthtml'); // pipe html through several plugins

const spriteConfig = {
  mode: {
    stack: true
  },
  shape: {
    dimension: false
  }
};

function clean() {
  return del('build');
}

function copy() {
  return src([
      './fonts/**/*.{woff,woff2}',
      './img/**/*.{jpg,png}',
      './*.ico'
    ],
    { base: '.' })
    .pipe(dest('build'));
}

function js() {
  return src('js/**/*.js')
    .pipe(minifyJS())
    .pipe(rename('script.min.js'))
    .pipe(dest('build/js'))
}

function sprite() {
  return src('img/*.svg')
    .pipe(svgSprite(spriteConfig))
    .pipe(rename('sprite.svg'))
    .pipe(dest('build/img'));
}

function css() {
  return src('sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(minifyCSS())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
}

function html() {
  return src('*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(minifyHTML({ collapseWhitespace: true }))
    .pipe(dest('build'))
}

function refresh(done) {
  browserSync.reload();
  done();
}

function server() {
  browserSync.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  watch('sass/**/*.scss', series(css));
  watch('js/**/*.js', series(js));
  watch('*.html', series(html, refresh));
}

exports.clean = clean;
exports.copy = copy;
exports.js = js;
exports.sprite = sprite;
exports.css = css;
exports.html = html;
exports.refresh = refresh;
exports.server = server;

exports.build = series(clean, copy, sprite, js, css, html);
exports.start = series(clean, copy, sprite, js, css, html, server);
