/**
 * Created by jerryli on 2016/12/7.
 */

function addJSPlugin(options) {
    this.options = options;
}

addJSPlugin.prototype.apply = function(compiler) {
    var pluginOptions = this.options;
    compiler.plugin('compilation', function(compilation, options) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
            //console.log(compilation.getStats().compilation.modules)
            /**
            compilation.modules.forEach((item,i)=>{
                !item.resource &&  console.log(item,item.resource)
            })
             **/

            if(pluginOptions.callback){
                pluginOptions.callback(compilation,htmlPluginData.assets,options);
            }
            /**
            for (var i = paths.length - 1; i >= 0; i--) {
                htmlPluginData.assets.js.unshift(paths[i]);
            }
             **/
            callback(null, htmlPluginData);
        });
    });
};

module.exports = addJSPlugin;