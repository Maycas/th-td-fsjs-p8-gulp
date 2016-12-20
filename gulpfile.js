'use strict';

var gulp = require('gulp'), // Gulp core
    uglify = require('gulp-uglify'), // Javascript minifier
    concat = require('gulp-concat'), // File concatenator
    maps = require('gulp-sourcemaps'), // Sourcemaps generator
    rename = require('gulp-rename'), // File renaming plugin
    eslint = require('gulp-eslint'), // JS lint plugin
    sass = require('gulp-sass'), // SASS compiler
    csso = require('gulp-csso'), // CSS minifier
    usemin = require('gulp-usemin'), // Replaces references to non-optimized scripts or stylesheets into a set of HTML files
    imagemin = require('gulp-imagemin'), // Image optimizer
    replace = require('gulp-replace-path'), // Path replacer for html and text files
    browserSync = require('browser-sync').create(),
    del = require('del'); // Delete package

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
 * 'compileSass' gets the global.scss file and compiles it into css inside the source folder
 */
gulp.task('compileSass', function () {
    return gulp.src(options.src + '/sass/global.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.src + '/css'));
});

/**
 * 'styles' waits for 'compileSass' to finish and then minifies and moves it to the distribution folder
 */
gulp.task('styles', ['compileSass'], function () {
    return gulp.src(options.src + '/css/global.css')
        .pipe(csso())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest(options.dist + '/styles'));
});

/**
 * 'images' gets all the images from the images folder and copies them into the content folder inside of the distribution folder
 */
gulp.task('images', function () {
    return gulp.src(options.src + '/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist + '/content'));
});

/**
 * 'clean' deletes all contents in the distribution folder and the files generated inside of the source folder
 */
gulp.task('clean', function () {
    del(['dist', options.src + '/css', options.src + '/js/all.js*']);
});

/**
 * 'html' waits for 'scripts' and 'styles' to finish and then replaces the styles and script URL's 
 * in index.html with the new ones on distribution. Moreover it also changes the route of all images for 
 * the new in the distribution folder
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
 * Builds the distribution folder and all the necessary files for development inside of the source folder
 */
gulp.task('build', ['clean'], function () {
    gulp.start(['html', 'images']);
});

/**
 * 'watch' watches for any change in the javascript or css styles and runs the tasks again
 */
gulp.task('watch', function () {
    gulp.watch([options.src + '/js/**/*.js'], ['scripts']);
    gulp.watch([options.src + '/sass/**/*.scss', options.src + 'sass/**/*.sass'], ['styles']);
});

/**
 * 'serve' runs the 'scripts' and 'styles' and serves the distribution folder through an HTTP server.
 * In case any JS or SASS file has changed, then the browser is reloaded
 */
gulp.task('serve', ['scripts', 'styles'], function () {
    browserSync.init({
        server: {
            baseDir: options.dist,
            index: 'index.html'
        }
    });
    gulp.start('watch');
    gulp.watch([options.dist + '/**']).on('change', browserSync.reload);
});


/**
 * Gulp's 'default' task will run 'build'
 */
gulp.task('default', ['build']);