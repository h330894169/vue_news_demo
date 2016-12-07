var gulp = require("gulp");
var webpack = require("webpack");
var gutil = require("gulp-util");
var server = require("./lib/server.js");
var argv = require('yargs').argv;//获取命令行参数
var path = require("path");

//设置node环境
if(argv.d || !argv.p){
    process.env.NODE_ENV = "dev";
}else{
    process.env.NODE_ENV = "production";
}


gulp.task("webpack",['webpack-dll'], function(callback) {    // run webpack
    var compiler = webpack(
        require("./webpack.config.js")
        , function(err, stats) {
            if(err) throw new gutil.PluginError("webpack", err);
            console.log("******************************************************")
            gutil.log("[webpack]",stats.toString({
                colors: true,
                chunks: false,
                hash: false,
                version: false
            }));
            //callback();
    })/** .watch(100,function(err, stats) {
        console.log("------>")
    });**/;
    callback();
});


gulp.task("webpack-dll", function(callback) {    // run webpack
    var compiler = webpack(
        require("./webpack.dll.config.js")
        , function(err, stats) {
            if(err) throw new gutil.PluginError("webpack", err);
            console.log("******************************************************")
            gutil.log("[webpack]",stats.toString({
                colors: true,
                chunks: false,
                hash: false,
                version: false
            }));
            callback();
        })/** .watch(100,function(err, stats) {
        console.log("------>")
    });**/;
    //callback();
});

gulp.task("clean", function(){
    return gulp.src("dist")
        .pipe(clean());
})

gulp.task('watch', ['webpack'],function() {
    var s = server({
        watchCallBack:function(){
            //gulp.run("webpack")
        },
        dataSource:argv.s
    });
    var timer = null;
    // 看守所有.scss档
    gulp.watch('dist/**',{readDelay:100},function(file){
        clearTimeout(timer);
        timer = setTimeout(function(){
            //console.log(file);
            if(path.extname(file.path)=="css"){
                s.reload("*.css");
            }else{
                s.reload();
            }
        },100)
    });
});

