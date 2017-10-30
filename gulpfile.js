// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var scsslint = require('gulp-scsslint');
var livereload = require('gulp-livereload');
var soften = require('gulp-soften');
var size = require('gulp-size');
var lr = require('tiny-lr');
var mainBowerFiles = require('main-bower-files');
var server = lr();


// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(soften(4))
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(size({title: 'css'}))
        .pipe(gulp.dest('public/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(size({title: 'css.min'}))
        .pipe(gulp.dest('public/css'))
        .pipe(livereload(server));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['src/js/jquery/jquery.js','src/js/plugins/*.js','src/js/*.js'])
        .pipe(soften(4))
        .pipe(concat('app.js'))
        .pipe(size({title: 'js'}))
        .pipe(gulp.dest('public/js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(size({title: 'js.min'}))
        .pipe(gulp.dest('public/js'))
        .pipe(livereload(server));
});

// Set up image minification
gulp.task('images', function() {
    return gulp.src('src/images/**')
        .pipe(cache(imagemin({ optimizationLevel: 9, progressive: false, interlaced: false })))
        .pipe(gulp.dest('public/images'))
        .pipe(livereload(server));
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**')
        .pipe(gulp.dest('public/fonts/'));
});

// Livereload
gulp.task('listen', function(next) {
    server.listen(35729, function(err) {
        if (err) return console.log;
        next();
    });
});

var filesToMove = [
    './public/**'
];

gulp.task('move', function(){
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src(filesToMove, { base: './' })
        .pipe(gulp.dest('../'));
});

gulp.task("bower:copyfiles:dev", function(cb){
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./src/js/lib'))
    cb();
});

gulp.task("bower:copyfiles", function(cb){
    return gulp.src(mainBowerFiles())
        .pipe(soften(4))
        .pipe(size({title: 'js'}))
        .pipe(gulp.dest('public/js/lib'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(size({title: 'js.min'}))
        .pipe(gulp.dest('public/js/lib'))

    cb();
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/js/jquery/*.js', ['scripts']);
    gulp.watch('src/js/plugins/*.js', ['scripts']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/images/**', ['images']);
    gulp.watch('src/fonts/**', ['fonts']);

    gulp.watch('public/fonts/**', ['move']);
    gulp.watch('public/css/**', ['move']);
    gulp.watch('public/images/**', ['move']);
    gulp.watch('public/js/**', ['move']);

    gulp.watch('*.html').on('change', function(file) {
        livereload(server).changed(file.path);
    });
});

// Default Task
gulp.task('default', ['sass', 'scripts', 'images', 'fonts', 'listen', 'move', 'bower:copyfiles:dev', 'bower:copyfiles', 'watch']);