var path = require("path");
var argv = require('yargs').argv;//获取命令行参数
var externalsList = [
    {
        name:"jquery",
        value:"jQuery",
        path:['jquery','dist','jquery.min.js'].join("/")
    },
    {
        name:"vue",
        value:"Vue",
        path:["vue","dist","vue.min.js"].join("/")
    },
    {
        name:"vue-router",
        value:"VueRouter",
        path:["vue-router","dist","vue-router.min.js"].join("/")
    }
]
var getExternals = function (isGlobalObj) {
    var temp = {};
    if(isGlobalObj){
        //返回全局对象给webpack做配置项使用
        externalsList.map(item=>{
            temp[item.name] = item.value;
        })
        /**
        return {
            jquery : "jQuery",
            vue : "Vue",
            'vue-router' : "VueRouter"
        }
         **/
        return temp
    }
    //返回文件路径供插件比对，加上第三方文件

    return externalsList
}

module.exports = {
    src:"./src",
    dist:!argv.d ?"./dist":"./dist.demo",
    dll_path:"./.tmp",
    cdnPath:!argv.d ?"//res.ziztour.com":"//demo.res.ziztour.com",
    serverDir:".tmp",
    distServerDir:"./dist",
    //webpack打包对外暴露的文件路径
    externals:getExternals,
    apiSource:"",
    version:""
}