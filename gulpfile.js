'use strict';

var del = require('del');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-replace-task');
var server = require('browser-sync').create();

gulp.task('html', function () {
  var htmlmin = require('gulp-htmlmin');
  var nunjucks = require('gulp-nunjucks');
  return gulp.src('source/**/*.html')
    .pipe(nunjucks.compile())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build'))
    .pipe(server.stream());
});

gulp.task('css', function () {
  var autoprefixer = require('autoprefixer');
  var csscomb = require('gulp-csscomb');
  var cssmin = require('gulp-csso');
  var mqpacker = require('css-mqpacker');
  var postcss = require('gulp-postcss');
  var plumber = require('gulp-plumber');
  var rename = require('gulp-rename');
  var sass = require('gulp-sass');
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      mqpacker(),
      autoprefixer()
    ]))
    .pipe(csscomb())
    .pipe(replace({
      patterns: [{
        match: /}(?=\n[^\n}])/g,
        replacement: '}\n'
      }],
      usePrefix: false
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(cssmin())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('js', function () {
  var concat = require('gulp-concat');
  var uglify = require('gulp-uglify');
  var srcList = [
    'source/js/begin.js',
    'source/js/select.js',
    'source/js/menu.js',
    'source/js/popup.js',
    'source/js/slider.js',
    'source/js/ajax.js',
    'source/js/end.js',
    'node_modules/picturefill/dist/picturefill.min.js'
  ];
  return gulp.src(srcList)
    .pipe(concat('script.min.js'))
    .pipe(uglify({
      compress: false
    }))
    .pipe(replace({
      patterns: [{
        match: /;"use strict";/g,
        replacement: ';'
      }],
      usePrefix: false
    }))
    .pipe(gulp.dest('build/js'))
    .pipe(server.stream());
});

gulp.task('sprite', function () {
  var spritesmith = require('gulp.spritesmith');
  var spriteData = gulp.src('source/img/sprite/*.png')
    .pipe(spritesmith({
      padding: 30,
      imgName: 'sprite.png',
      cssName: 'sprite.css'
    }));
  spriteData.img.pipe(gulp.dest('build/img'));
  spriteData.css.pipe(gulp.dest('build/css'));
});

gulp.task('sprite:optim', function () {
  return gulp.src('build/img/sprite.png')
    .pipe(imagemin([
      imagemin.optipng()
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task('img', function () {
  var jpegoptim = require('imagemin-jpegoptim');
  return gulp.src('source/img/*.{png,jpg}')
    .pipe(imagemin([
      imagemin.optipng(),
      jpegoptim({
        max: 70,
        progressive: true
      })
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task('webp', function () {
  var webp = require('gulp-webp');
  return gulp.src('source/img/*.{png,jpg}')
    .pipe(webp({
      quality: 70
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('copy', function () {
  var files = [
    'source/fonts/**/*.{woff,woff2}',
    'source/js/**/*.json'
  ];
  return gulp.src(files, {
    base: 'source'
  })
    .pipe(gulp.dest('build'));
});

gulp.task('build:prepare', function () {
  return del('build');
});

gulp.task('build', function (done) {
  var run = require('run-sequence');
  run('build:prepare', [
    'copy',
    'html',
    'css',
    'js',
    'img',
    'webp',
    'sprite'
  ], 'sprite:optim', done);
});

gulp.task('build:clean', function () {
  return del('build/css/sprite.css');
});

gulp.task('serve', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch('source/sass/**/*.{scss,sass}', ['css']);
  gulp.watch('source/njk/**/*.njk', ['html']);
  gulp.watch('source/**/*.html', ['html']);
  gulp.watch('source/js/**/*.js', ['js']);
});
