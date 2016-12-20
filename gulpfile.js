'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    maps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    replace = require('gulp-replace-path'),
    del = require('del');

// Global options variable with the folder destinations
var options = {
    src: 'src',
    dist: 'dist'
};

/**
 * 'lint' applies the eslinter to all js files using the rules defined in .eslintrc.json
 */
gulp.task('lint', function () {
    return gulp.src(options.src + '/js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/**
 * 'concatScripts' waits for 'lint' task to finish and then concatenates all the js files in the src folder, 
 * creates the sourcemap file and writes it in the src folder
 */
gulp.task('concatScripts', ['lint'], function () {
    return gulp.src([
            options.src + '/js/circle/*.js',
            options.src + '/js/global.js'
        ])
        .pipe(maps.init())
        .pipe(concat("all.js"))
        .pipe(maps.write('/.'))
        .pipe(gulp.dest(options.src + '/js'));
});

/**
 * 'scripts' waits 'concatScripts' task to finish, minimizes the whole concatenated js files 
 * and copies it in the scripts 'dist' folder 
 */
gulp.task('scripts', ['concatScripts'], function () {
    return gulp.src(options.src + '/js/all.js')
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest(options.dist + '/scripts'));
});

/**
 * TODO: Comments
 */
gulp.task('compileSass', function () {
    return gulp.src(options.src + '/sass/global.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.src + '/css'));
});

/**
 * TODO: Comments
 */
gulp.task('styles', ['compileSass'], function () {
    return gulp.src(options.src + '/css/global.css')
        .pipe(csso())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest(options.dist + '/styles'));
});

/**
 * TODO: Comments
 */
gulp.task('images', function () {
    return gulp.src(options.src + '/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist + '/content'));
});

/**
 * TODO: Comments
 */
gulp.task('clean', function () {
    del(['dist', options.src + '/css', options.src + '/js/all.js*']);
});

/**
 * TODO: Comments !!! ERROR is here, in html
 */
gulp.task('html', ['scripts', 'styles'], function () {
    return gulp.src(options.src + '/index.html')
        .pipe(usemin({
            js: [uglify()],
            css: [csso()]
        }))
        .pipe(replace('images/', 'content/'))
        .pipe(gulp.dest(options.dist));
});

/**
 * TODO: Comments
 */
gulp.task('build', ['clean'], function () {
    //gulp.start(['scripts', 'styles', 'images']);
    return gulp.start(['html', 'images']);
});

/**
 * TODO: Comments
 */
gulp.task('default', ['build']);