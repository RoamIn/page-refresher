const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

const BUILD_FILE_BASE_NAME = 'page-refresher';
const VERSION = require('./package.json').version;

// clear old files
gulp.task('clean', () => {
    del.sync([
        `dist/${ VERSION }`
    ]);
});

// sass
gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(rename({
        basename: BUILD_FILE_BASE_NAME
    }))
    .pipe(gulp.dest(`dist/${ VERSION }/css`));
});

// compressed sass
gulp.task('sass-min', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({
            basename: BUILD_FILE_BASE_NAME,
            suffix: '.min'
        }))
        .pipe(gulp.dest(`dist/${ VERSION }/css`));
});

// es6
gulp.task('es6', () => {
    return gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(rename({
            basename: BUILD_FILE_BASE_NAME
        }))
        .pipe(gulp.dest(`dist/${ VERSION }/js`))
        .pipe(uglify())
        .pipe(rename({
            basename: BUILD_FILE_BASE_NAME,
            suffix: '.min'
        }))
        .pipe(gulp.dest(`dist/${ VERSION }/js`));
});

// uglify js
gulp.task('uglify', function () {
    return gulp.src('dist/*.js')
        .pipe(uglify())
        .pipe(rename({
            basename: BUILD_FILE_BASE_NAME,
            suffix: '.min'
        }))
        .pipe(gulp.dest(`dist/${ VERSION }/js`));
});

gulp.task('default', ['clean', 'sass', 'sass-min', 'es6']);
