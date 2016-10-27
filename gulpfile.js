var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var spriter = require('gulp-css-spriter');

var paths = {
    html: {
        entry: './src/html/*.*',
        all: 'src/html/**/*.*'
    },
    sass: {
        entry: './src/css/*.scss',
        all: 'src/css/**/*.scss'
    },
    js: {
        entry: './src/js/*.js',
        all: 'src/js/**/*.js'
    },
    images: {
        all: 'src/images/**/*.js'
    },
    json:{
        all: 'src/json/**/*.json'
    }
}

// var webpackcfg = require('./webpack.config.js')(paths);

//copy file to src folder
gulp.task('copy',['lib','images','json']);
gulp.task('lib', function () {
    gulp.src('./src/lib/**/*')
        .pipe(gulp.dest('./dist/lib/'));

});
gulp.task('images', function () {
    gulp.src('./src/images/**/*')
        .pipe(gulp.dest('./dist/images/'));

});
gulp.task('json', function () {
    gulp.src('./src/json/**/*.json')
        .pipe(gulp.dest('./dist/json/'));

});

//compile swig file
gulp.task('html', function () {
    gulp.src(paths.html.entry)
        .pipe($.nunjucks.compile())
        .pipe(gulp.dest('./dist/html'))
});
//compile sass file
gulp.task('sass', function () {
    gulp.src(paths.sass.entry)
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer('last 2 version', 'android 4'))
        // .pipe(spriter({
        //     // The path and file name of where we will save the sprite sheet
        //     'spriteSheet': './dist/images/spritesheet.png',
        //     // Because we don't know where you will end up saving the CSS file at this point in the pipe,
        //     // we need a litle help identifying where it will be.
        //     'pathToSpriteSheetFromCSS': '../images/spritesheet.png'
        // }))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(reload({
            stream: true
        }));

});
gulp.task('sass-debug', function () {
    gulp.src(paths.sass.entry)
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer('last 2 version', 'android 4'))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(reload({
            stream: true
        }));

});
//compile js file
gulp.task('js', function () {
    gulp.src(paths.js.entry)
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({
            stream: true
        }));
});
gulp.task('js-debug', function () {
    gulp.src(paths.js.entry)
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(reload({
            stream: true
        }));
});
//listen file modify
gulp.task('watch', function () {

    browserSync.init({
        //任何文件改变就刷新
        // files: "**", 

        notify: false,

        //指定文件改变刷新
        files: ["./dist/**/*.html", "./dist/**/*.js"],

        // 动态站点
        // proxy: "localhost:8080/xxx/index.action"

        // 静态站点
        server: {
            baseDir: "./dist/",
            directory: true, //在网页显示项目文件结构
            index: "html/index.html"
        }
    })

    gulp.watch(paths.json.all, ['json']);
    gulp.watch(paths.images.all, ['copy']);
    gulp.watch(paths.html.all, ['html']);
    gulp.watch(paths.sass.all, ['sass']);
    gulp.watch(paths.js.all, ['js']);
})

var commTask = ['copy', 'html', 'sass', 'js'];
var debugTask = ['copy', 'html', 'sass-debug', 'js-debug'];

gulp.task('debug', debugTask.concat('watch'));
gulp.task('build', commTask);
gulp.task('default', ['debug']);