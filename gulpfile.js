'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    maps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    //sass = require('gulp-sass'),
    //maps = require('gulp-sourcemaps'),
    //useref = require('gulp-useref'),
    //imagemin = require('gulp-imagemin'),
    //csso = require('gulp-csso'),
    //ifff = require('gulp-if'),
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
        .pipe(eslint.failAfterError())
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
        .pipe(gulp.dest(options.dist + '/scripts'))
});