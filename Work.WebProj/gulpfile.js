/// <binding />
/// <vs SolutionOpened='default' />
var gulp = require('gulp');
//var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');
var concat = require('gulp-concat');
//var imagemin = require('gulp-imagemin');
var react = require('gulp-react');
var strip = require('gulp-strip-comments'); //移除註解

//後台共同引用的js打包處理
gulp.task('commHdl', function () {
    var jsfiles = [
        'Scripts/build/ts/def/defData.js',
        'Scripts/app/moment/moment.min.js',
        'Scripts/app/moment/locale/zh-tw.js',
        'Scripts/jquery/jquery-2.1.4.min.js',
        'Scripts/react/react-with-addons.min.js',
        'Scripts/app/bootstrap.min.js',
        'Scripts/app/react-bootstrap.min.js',
        'Scripts/app/toastr.min.js',
        'Scripts/build/ts/commfunc.js',
        'Scripts/build/func/inc/c-Comm.js'
    ];

    return gulp.src(jsfiles)
        .pipe(strip({ safe: true }))
        .pipe(concat('comminc.js'))
        .pipe(gulp.dest('Scripts/build/'));
});

gulp.task('commHdlX', function () {
    var jsfiles = [
        'Scripts/build/ts/def/defData.js',
        'Scripts/app/moment/moment.min.js',
        'Scripts/app/moment/locale/zh-tw.js',
        'Scripts/jquery/jquery-2.1.4.min.js',
        'Scripts/react/react-with-addons.min.js',
        'Scripts/app/bootstrap.min.js',
        'Scripts/app/react-bootstrap.min.js',
        'Scripts/app/toastr.min.js',
        'Scripts/build/ts/commfunc.js',
        'Scripts/build/func/c-comm.js'
    ];

    return gulp.src(jsfiles)
        .pipe(strip({ safe: true }))
        .pipe(concat('commincx.js'))
        .pipe(gulp.dest('Scripts/build/'));
});


//react 處理
gulp.task('reactHdl', function () {
    var jsxfiles = ['Scripts/src/jsx/*.jsx'];

    return gulp.src(jsxfiles)
        .pipe(react())
        .pipe(uglify())
        .pipe(gulp.dest('Scripts/build/func/'));
});

gulp.task('reactIncHdl', function () {
    var jsxfiles = ['Scripts/src/jsx-inc/*.jsx'];

    return gulp.src(jsxfiles)
        .pipe(react())
        .pipe(uglify())
        .pipe(gulp.dest('Scripts/build/func/inc/'));
});

//typescript min化 處理
gulp.task('tsHdl', function () {
    var jsfiles = [
        'Scripts/ts-def/*.js',
        'Scripts/ts-def/d.ts/*.js',
        'Scripts/ts-def/def/*.js',
        'Scripts/ts-def/widegt/*.js'
    ];

    return gulp.src(jsfiles, { base: 'Scripts/ts-def' })
        .pipe(uglify())
        .pipe(gulp.dest('Scripts/build/ts/'));
});

//typescript min化 處理
gulp.task('tsxHdl', function () {
    var jsfiles = [
        'Scripts/src/tsx/*.js'
    ];

    return gulp.src(jsfiles, { base: 'Scripts/src/tsx' })
        .pipe(uglify())
        .pipe(gulp.dest('Scripts/build/func/'));
});



//default task
gulp.task('default', function () {
    gulp.run('tsHdl', 'tsxHdl', 'reactHdl', 'reactIncHdl', 'commHdl', 'commHdlX');
    //監控react js 文件變化
    gulp.watch('Scripts/src/jsx/*.jsx', function () {
        gulp.run('reactHdl');
    });

    gulp.watch('Scripts/src/jsx-inc/*.jsx', function () {
        gulp.run('reactIncHdl');
        gulp.run('commHdl');
    });

    gulp.watch('Scripts/src/tsx/*.js', function () {
        gulp.run('tsxHdl');
    });
});