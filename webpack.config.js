var fs = require("fs");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var glob = require("glob");
var css_util = require("./lib/util.js")
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var bowerRoot = __dirname+"/bower_components";
var is_dev = process.env.NODE_ENV !== "production";
const config = require("./lib/config");
var srcDir = config.src;
/**
console.log(css_util.cssLoaders({
    sourceMap: is_dev?true:false,
    extract: true
}))
 **/

function getHashName() {
    return !is_dev?'.[hash:8]':'';
}
var htmlGenerator = function () {
    var r = [];
    var entryHtml = glob.sync(srcDir + '/*.html');

    entryHtml.forEach(function (filePath) {
        //var matchs = filePath.match(/(.+)\.html$/);//filePath.substring(filePath.lastIndexOf('src/') + 4, filePath.lastIndexOf('.'));
        var filenameArray =path.basename(filePath,".html").split(".");
        var htmlName = filenameArray[0];
        //这里是构建common
        /**
         r.push(new CommonsChunkPlugin({
            name: "common_"+htmlName,
            //minChunks:3,
            //minSize: 2,
            chunks:[htmlName,'vendors'].concat(filenameArray.slice(1)),
            filename: "js/[name].[hash:8].js"
        }))
         **/
        r.push(
            new HtmlWebpackPlugin({
                filename: htmlName + '.html',
                chunks: [htmlName,'vendors','vendor_dll'],
                template:filePath
            })
        );
        //console.log(r)
    });
    !is_dev&& r.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
    return r;
};
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    files["vendor_dll"] = path.resolve(config.dll_path , "vendor.dll.js");
    /**
     files['vendors'] = ['jquery','angular'];
     files['jquery'] = ['jquery'];
     files['angular'] = ['angular'];
     **/
    return files;
}

module.exports  = {
    devtool:is_dev?"cheap-eval-source-map	":'eval',
    // configuration
    //页面入口文件配置
    entry: getEntry(),
    //入口文件输出配置
    output: {
        chunkFilename: "js/[id].chunk"+getHashName()+".js",
        path: path.join(__dirname, "dist/"),
        filename: 'js/[name]'+getHashName()+'.js',
        library: "[name]_library"
    },
    watch:is_dev?true:false,
    cache:true,
    amd: { jQuery: true},
    perLoaders: [
        {
            test: /\.(js)$/, // include .js files
            exclude: /node_modules|bower_components/, // exclude any and all files in the node_modules folder
            loader: "jshint-loader"
        }
    ],
    module: {
        //加载器配置
        loaders: [
            //{test: require.resolve('angular'), loader: 'expose?angular'},
            //{ test: /demo\.js$/, loader: "expose?demov" },
            //{ test: /angular\.js$/, loader: "expose?angular" },
            //{ test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", ["css-loader?-autoprefixer","postcss-loader"],{publicPath : "../"}) },
            //{ test: /\.css$/, loader: "style-loader!css-loader" },
            //{ test: /\.js$/, loader: 'jsx-loader?harmony' },
            { test: /\.html/, loader: 'html-loader' },
            //{ test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            //{test: /\.less$/, loader: "style!css!less"},
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=fonts/[name]"+getHashName()+".[ext]" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=fonts/[name]"+getHashName()+".[ext]" },
            { test: /\.(png|jpg)$/, loader: 'file-loader?name=img/[name]'+getHashName()+'.[ext]&limit=8192'},
            { test: /\.vue$/, loader: 'vue' },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|\.tmp)/,
                loader: 'babel'
            }
        ].concat(css_util.styleLoaders({
                sourceMap: is_dev?true:false,
                extract: true
            }))
    },
    postcss:[autoprefixer({browsers:['last 15 versions']})],
    vue: {
        loaders: css_util.cssLoaders({
            sourceMap: is_dev?true:false,
            extract: true
        })/**{
            //css:ExtractTextPlugin.extract("style-loader", ["css?-autoprefixer","postcss-loader"],{publicPath : "../"}),//"vue-style-loader!css-loader",
            //html:'vue-html-loader',
            //sass: ExtractTextPlugin.extract('vue-style-loader', 'css-loader!sass-loader')
        }**/
    }
    ,
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    externals: {
        //jQuery: 'jQuery' //或者jquery:'jQuery',
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest:require('./.tmp/vendor-manifest.json')
        }),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'],["normal", "loader"])
        ),
        //将公共代码抽离出来合并为一个文件
        new CommonsChunkPlugin({
            //minChunks: 0,
            //minChunks:3,
            name: "vendors",
            chunks:Object.keys(getEntry()),
            filename: "js/[name]"+getHashName()+".js"
        }),
    /**
     new CommonsChunkPlugin({
                //minChunks: 0,
                //minChunks:Infinity,
                name: "commons",
                chunks:["index",'vendors'],
                //chunks:["vendors","index"],
                filename: "js/[name].[hash:8].js"
            }),
     new CommonsChunkPlugin({
                //minChunks: 0,
                //minChunks:Infinity,
                name: "commons2",
                chunks:["xx",'jquery'],
                //chunks:["vendors","index"],
                filename: "js/[name].[hash:8].js"
            }),
     **/
    /** new CommonsChunkPlugin('commons','js/commons.js'),**/
        new ExtractTextPlugin("css/[name]"+getHashName()+".css"/*,{   allChunks : true}*/),
    /**
     new HtmlWebpackPlugin({
                filename: 'index.html',
                chunks: ['commons','index'],
                title: 'Hello World app',
                template:"src/index.html"
            }),
     new HtmlWebpackPlugin({
                filename: 'index2.html',
                chunks: ['commons2','xx'],
                title: 'Hello World appxx',
                template:"src/demo2.html"
            }),
     **/
        //provide $, jQuery and window.jQuery to every script
        new webpack.ProvidePlugin({
            //'angular': 'expose?angular!angular',
            //'demov': 'expose?demov!demo',
            //$: "jquery",
            //jQuery: "jquery",
            //"window.jQuery": "jquery"
        })
    /**,
     new BrowserSyncPlugin({
                // browse to http://localhost:3000/ during development,
                // ./public directory is being served
                host: 'localhost',
                port: 3000,
                server: { baseDir: ['dist'] }
            })**/
    ].concat(htmlGenerator()),
    //其它解决方案配置
    resolve: {
        modulesDirectories : [ 'node_modules', 'bower_components' ],
        root: './src', //绝对路径
        extensions: ['', '.js', '.json', '.scss','.vue','.css'],
        alias: {
            vue: path.resolve(__dirname,"./bower_components/vue/dist/vue.js"),
            bower: bowerRoot,
            demo:path.resolve(__dirname,"./src/js/lib/demo"),
            //"vue-router":path.resolve(__dirname,"./bower_components/vue-router/dist/vue-router"),
            angular:path.resolve(__dirname,"./bower_components/angular/angular.min"),
            jquery:path.resolve(__dirname,"./bower_components/jquery/dist/jquery")
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, './node_modules'),path.join(__dirname, './bower_components')]
    }
}