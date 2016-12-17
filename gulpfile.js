'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del'),
    useref = require('gulp-useref'),
    csso = require('gulp-csso'),
    ifff = require('gulp-if');

var options = {
    src: 'src',
    dist: 'dist'
};