import $ from "jquery";
import Vue from 'vue';
import Router from "vue-router";
import App from '../app.vue';
import store from '../vuex/store.js';

Vue.use(Router)
const a = {
    template:'<i>a </i>'
}
// routing
const router = new Router({
    routes:[{
                path: '/header',
                component: require('../components/myheader.vue'),
                children: [
                    {
                        // 当 /user/:id/profile 匹配成功，
                        // UserProfile 会被渲染在 User 的 <router-view> 中
                        path: 'a',
                        component: a
                    }]
            },  {
                path: '/home',
                component: require('../components/home.vue')
        }]
})
/* eslint-disable no-new */
new Vue({
    router,
    el: '#app',
    store,
    render: h => h(App)
})
