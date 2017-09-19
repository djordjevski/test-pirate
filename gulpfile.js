var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require("browser-sync").create(),
    useref = require("gulp-useref"),
    lazypipe = require('lazypipe'),
    uglify = require("gulp-uglify"),
    gulpIf = require("gulp-if"),
    cssnano = require("gulp-cssnano"),
    del = require("del"),
    runSequence = require("run-sequence");


// sass = Compile SCSS files to a CSS file
gulp.task("sass", function(){
    return gulp.src("dev/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 2 versions", "ie >= 10"]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dev/css"))
        .pipe(browserSync.reload({
            stream: true
        }));
});


// fonts = Copy fonts to 'dist' folder
gulp.task("fonts", function(){
    return gulp.src("dev/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"));
});

// watch =  Watch specified files and trigers targeted tasks on file change
gulp.task("watch", ["browserSync", "sass"], function(){
    gulp.watch("dev/scss/**/*.scss", ["sass"]);
    gulp.watch("dev/*.html", browserSync.reload);
    gulp.watch("dev/js/**/*.js", browserSync.reload);
});


// browserSync = Run local server to enable live reload
gulp.task("browserSync", function(){
    browserSync.init({
        server: {
            baseDir: "dev"
        }
    });
});


// clear = Delete 'dist' folder for clean start before building
gulp.task("clear", function(){
    return del.sync("dist");
});


// Useref = Bundle JS or CSS to a signle file
gulp.task("useref", function() {
    return gulp.src("dev/*.html")
        .pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
        .pipe(gulpIf("*.js", uglify()))
        .pipe(gulpIf("*.css", cssnano()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"))
});


// default = Runs 'watch' task which will start local server
gulp.task("default", ["watch"]);


// build = Clear 'dist' folder and build app from scratsch
gulp.task("build", function(){
    runSequence("clear", ["sass", "fonts", "useref"])
});