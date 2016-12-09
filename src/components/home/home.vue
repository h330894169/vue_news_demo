<style scoped="">
    @import url(../header/style.css);
    .clearfix:after{
        content: '';
        display: block;
        clear: both;
    }
    .container{
        height:100px;
        background: #0093dd;
        color: #000000;
    }
</style>
<style lang="sass">
    .a
        a
            color red

</style>
<template>
    <div class="container">
        <div class="a"><a>555</a></div>

        -{{name}}-
    </div>
</template>
<script>
import $ from "jquery"
    export default {
        props:["name"],
        data(){
            return {
                msg:"msg"
            }
        },
        created:function(){
            const a = 1;
            let DemoFunc = () =>{
                console.log(arguments)
            }
            DemoFunc(221)

        },
        compiled:function(){

            console.log("home compiled")
        },
    beforeDestroy(){
            console.log("home destroy")
        }
    }
</script>