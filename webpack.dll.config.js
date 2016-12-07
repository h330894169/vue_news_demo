const path = require('path');
const webpack = require('webpack');
const config = require("./lib/config");

module.exports = {
    entry: {
        vendor: ['vue', 'jquery']
    },
    output: {
        path: path.join(__dirname, config.dll_path),
        filename: '[name].dll.js',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: '[name]_library'
    },
    resolve: {
        modulesDirectories : [ 'node_modules', 'bower_components' ],
        root: './src', //绝对路径
        extensions: ['', '.js', '.json', '.scss','.vue','.css'],
        alias: {
            vue: path.resolve(__dirname,"./bower_components/vue/dist/vue.js"),
            //bower: __dirname+"/bower_components",
            //demo:path.resolve(__dirname,"./src/js/lib/demo"),
            //"vue-router":path.resolve(__dirname,"./bower_components/vue-router/dist/vue-router"),
            //angular:path.resolve(__dirname,"./bower_components/angular/angular.min"),
            jquery:path.resolve(__dirname,"./bower_components/jquery/dist/jquery")
        }
    },
    plugins: [
        new webpack.DllPlugin({
            /**
             * path
             * 定义 manifest 文件生成的位置
             * [name]的部分由entry的名字替换
             */
            path: path.join(__dirname, config.dll_path, '[name]-manifest.json'),
            /**
             * name
             * dll bundle 输出到那个全局变量上
             * 和 output.library 一样即可。
             */
            name: '[name]_library'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};