"use strict";

const gulp         = require('gulp');
const del          = require('del');
const browserSync  = require('browser-sync').create();
const pug          = require('gulp-pug');
const autoprefixer = require('autoprefixer');
const svgSprite    = require('gulp-svg-sprites');
const svgmin       = require('gulp-svgmin');
const postcss      = require("gulp-postcss");
const cheerio      = require('gulp-cheerio');
const replace      = require('gulp-replace');
const plumber      = require("gulp-plumber");
const notify       = require("gulp-notify");
const spritesmith  = require("gulp.spritesmith");
const webp         = require("gulp-webp");

// styles
const sass         = require('gulp-sass');
const rename       = require('gulp-rename');
const sourcemaps   = require('gulp-sourcemaps');

// пути
const paths = {
  root: './docs',
  styles: {
    src: 'src/sass/**/*.scss',
    dest: 'docs/assets/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'docs/assets/scripts/'
  },
  templates: {
    src: 'src/templates/',
    dest: 'docs/assets/'
  },
  images: {
    src: 'src/images/**/*.{jpg,svg,png}',
    dest: 'docs/assets/images/'
  },
  icons: {
    src: 'src/images/icons/*.svg',
    dest: 'src/images/icons/'
  },
  contentImages: {
    src: 'src/images/content/*.{jpg,png}',
    dest: 'docs/assets/images/content/'
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    dest: 'docs/assets/fonts/'
  }
};

// pug
function html() {
  return gulp.src(paths.templates.src + "pages/*.pug")
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {title: "Html", message: err.message}
      })
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.root));
}

// scss
function style() {
  return gulp.src('./src/sass/style.scss')
    .pipe(plumber({
      errorHandler: notify.onError(function (err) {
        return {title: "Style", message: err.message}
      })
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemaps.write())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
}

// Формирование изображений в формате webp
function webpImage () {
  return gulp.src(paths.contentImages.src)
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(paths.contentImages.dest));
}

// перенос картинок
function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

// перенос шрифтов
function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
}

// перенос скриптов
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest));
}

// очистка папки docs
function clean() {
  return del(paths.root);
}

// следим за src и запускаем нужные таски (компиляция и пр.)
function watch() {
  gulp.watch(paths.styles.src, style);
  gulp.watch(paths.templates.src, html);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.fonts.src, fonts);
  gulp.watch(paths.scripts.src, scripts);
}

// следим за docs и релоадим браузер
function server() {
  browserSync.init({
    server: paths.root,
    reloadDelay: 200
  });
  browserSync.watch(paths.root + '/**/*.{html,css}', browserSync.reload);
}

// svg спрайт
function sprite() {
  return gulp.src(paths.icons.src)
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: "symbols",
      svg: {
        symbols: 'sprite.svg'
      }
    }))
    .pipe(gulp.dest(paths.icons.dest));
}

// png спрайт
function pngSprite() {
  return gulp.src(paths.icons.src)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      padding: 2,
      algorithm: 'top-down'
    }))
    .pipe(gulp.dest(paths.icons.dest));
}

// экспорт функций для доступа из терминала
exports.clean     = clean;
exports.style     = style;
exports.webpImage = webpImage;
exports.scripts   = scripts;
exports.html      = html;
exports.images    = images;
exports.watch     = watch;
exports.server    = server;
exports.fonts     = fonts;
exports.sprite    = sprite;
exports.pngSprite = pngSprite;

// сборка и слежка
gulp.task('default', gulp.series(
  clean,
  gulp.parallel(style, html, images, fonts, scripts, webpImage),
  gulp.parallel(watch, server)
));
