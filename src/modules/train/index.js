//import $ from "jquery";
import Vue from 'vue';
import Router from "vue-router";
//import App from './index/index.vue';
import store from 'common/stores/train';
//import http from 'common/js/http'

//import modelAlert from 'common/widgets/model-alert'
import "common/css/commons/global.styl"
import "./css/index.scss"
/**
require("../../components/header/style.css");
import "font-awesome/css/font-awesome.css"
 **/
require.ensure([],function (require) {
    require('bower/fastclick/lib/fastclick').attach(document.body);
})
Vue.use(Router)
//Vue.use(modelAlert)
// router
const router = new Router({
    //base: '/train/index.html',
    mode:"hash",/**
    scrollBehavior(to, from, savedPosition) {
        console.log(savedPosition)
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    },**/
    routes:[
        {
            name:"home",
            path: '',
            component: (resolve)=>require(['./index/index.vue'],resolve),
        }
        ,{
            name:'calendar',
            path: '/calendar',
            component: (resolve)=>require(['./select-calendar/calendar.vue'],resolve)
        },{
            path: '/city/:type',
            name:'city',
            component: (resolve)=>require(['./select-city/select-city.vue'],resolve)
        },{
            path: '/history',
            name:'history',
            component: (resolve)=>require(['./search-history/index.vue'],resolve)
        },{
            path: '/list',
            name:'list',
            component: (resolve)=>require(['./search-list/index.vue'],resolve)
        },{
            path: '/detail/'/**:train_no/:from_station_no/:to_station_no/:train_date/'**/,
            name:'detail',
            component: (resolve)=>require(['./detail/index.vue'],resolve)
        }
    ]
})
/* eslint-disable no-new */
new Vue({
    data:{
    },
    router,
    //el: '#app',
    store,
    //render: h => h(App),
    components:{
        //'model-alert':modelAlert
       // select-calendar:require("common/widgets/select-calendar/select-calendar.vue")
    }
}).$mount('#app');

//router.push("/")

