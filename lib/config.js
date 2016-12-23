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
    ,
    {
        name:"vuex",
        value:"Vuex",
        path:["vuex","dist","vuex.min.js"].join("/")
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
    //源码路径
    src:"./src",
    //编译输出的目录
    dist:!argv.d ?"./dist":"./dist.demo",
    //暂时无用
    dll_path:"./.tmp",
    //cdn根路径
    cdnPath:!argv.d ?"//static.train.ziztour.com":"//demo.static.train.ziztour.com",
    //拉起本地server目录
    serverDir:".tmp",
    //把编译输出的目录作为server根路径
    distServerDir:"./dist",
    //编译的第三方库路径
    dist3rd:!argv.d ?"./dist/3rd":"./dist.demo/3rd",
    //webpack打包对外暴露的文件路径
    externals:getExternals,
    apiSource:"",
    version:""
}