<template>
    <div class="btn1" :class="{ 'hover': isActive }">
        <a href="#" :class="{ 'disable': disable }">
            <slot></slot>
        </a>
    </div>
</template>
<script lang="ts" setup>
import { watch } from 'vue'
const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    },
    disable: {
        type: Boolean,
        default: false
    }
})
// watch(
//     ()=>props.isActive,
//     (news) => {
//         console.log(news)
//     })
</script>
<style lang="scss" scoped>
a:not(.disable):active {
    position: relative;
    top: 1px;
}

.btn1 {
    display: inline-block;
}

.btn1 a.disable {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn1 a {
    // width: 100px;
    // height: 40px;
    padding: 0 10px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    box-shadow: inset 0 1px 0 #617586, inset 0 0 40px 5px rgba(0, 0, 0, .3), 0 0 2px 1px rgba(0, 0, 0, .5);
    margin: 3px;
    display: block;
    background: #4a5e6f;
    text-align: center;
    line-height: 35px;
    text-decoration: none;
    color: #fff;
}

a:not(.disable):hover,
.btn1.hover a {
    box-shadow: inset 0 -1px 0 #617586, inset 0 2px 8px rgba(0, 0, 0, .5), inset 0 0 40px 5px rgba(0, 0, 0, .25)
        /*,0 0 2px 1px rgba(0,0,0,.5)*/
    ;
    color: #fff;
}

.btn1.hover a {
    color: yellow;
}
</style>