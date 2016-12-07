<style scoped>
    /*@import url(../css/style2.css);*/
ul li{
    display: flex;
    transform: translate3d(0,0,0);
    border-right: 1px solid red;
    float: left;
    width:100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    list-style: none;
    background: #0093dd;
    color: #fff;
}
    .clearfix:after{
        content: '';
        display: block;
        clear: both;
    }
    ol{
        z-index: 1;
        display: none;
    }

</style>
<template>
<div class="" v-on:click="increment()">
    -{{msg}}-{{testData.url}}-{{count}}
    <ul class="clearfix">
        <li class="menu"  v-for="c in header">
            <a v-bind:href="c.url">{{c.name}}</a>
            <ol>
                <li href="#!/home">subm1</li>
            </ol>
        </li>
    </ul>
    <transition name="fade"  mode="out-in">
        <router-view></router-view>
    </transition>
</div>
</template>

<script>
import $ from "jquery"
import { mapGetters,mapActions } from 'vuex'

export default {
    props:{
        "testData":{
            type:Object,
        default:()=>{return {url:"url"}}
        }
    },
    data(){
        return {
            msg:"msg",
            header:[{
                name:"m1",
                url:"http://www.baidu.com"
            },{
                name:"m2",
                url:"http://www.baidu.com"
            }]
        }
    },
    computed:{


    ...mapGetters(["count"])
        // mix the getters into computed with object spread operator
    },
    created:function(){
        require.ensure([], function(require) {
            var css = require('../css/style2.css');
            var ng = require('angular');
            // todo ...
        });

        $.get("/index.html").success(function() {
            //this.header[0].name="xxx"
            this.$set(this.header, 0, {
                name:"2452",
                url:"xx"
            })
            $(this.$el).on("mouseenter mouseleave", ".menu", function (e) {
                if (e.type == "mouseenter") {
                    $(this).find("ol").show()
                } else {
                    $(this).find("ol").hide()
                }

            })
        }.bind(this))
    },
    methods:{
        ...mapActions([
            'increment' //  map this.increment() to this.$store.dispatch('increment')
        ]),
        incrementa:function(){
            console.log(5555)
        }
    },
    compiled:function(){
        console.log("home compiled")
    },
    beforeDestroy(){
        console.log("home destroy")
    }
}
</script>