<template>
    <div>
        <p>
            <router-link to='/home' class="">
                home
            </router-link>
            <router-link to='/header' class="">
                header
            </router-link>
            <router-link to='/header/a' class="">
                header a
            </router-link>
            <router-link to='/header/b' class="">
                header b
            </router-link>
        </p>
        <transition name="fade"  mode="out-in">
            <router-view
                    class="view"
                    transition="back"
                    transition-mode="out-in">
            </router-view>
        </transition>

    </div>
</template>
<style>
    p{
        transition:all 0.3s;
    }
</style>
<script>
export default{
    name:"App"
}
</script>