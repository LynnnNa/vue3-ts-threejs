<template>
    <div class="box " :class="{ 'nohover': !hover, 'transform': transform }" ref="JsBuildingBox">
        <span v-if="animate"></span>
        <span v-if="animate" :style="{ width: boxHeight }"></span>
        <span v-if="animate"></span>
        <span v-if="animate" :style="{ width: boxHeight }"></span>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance, defineComponent, onMounted, onBeforeUnmount } from 'vue'
let boxHeight = ref(`248px`)
const props = defineProps({
    animate: {
        type: Boolean,
        default: false
    },
    hover: {
        type: Boolean,
        default: true
    },
    transform: {
        type: Boolean,
        default: false
    }
})
onMounted(() => {
    const instance = getCurrentInstance()
    const JsBuildingBox = instance.refs.JsBuildingBox
    boxHeight.value = JsBuildingBox?.clientHeight + 'px'
})
</script>
<style lang="scss" scoped>
.box {
    transform: translate(0, 0);
    // width: 250px;
    // min-height: 250px;
    box-sizing: border-box;
    box-shadow: 0 20px 50px rgb(23, 32, 90);
    border: 2px solid #2a3cad;
    color: white;
    border-radius: 5px;

    &:not(.transform) {
        background: rgba(17, 24, 69, 0.6);
    }
    &:not(.nohover) {
        overflow: hidden;
    }
}

.box:not(.nohover):before {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    transform: skewX(-20deg);
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transition: 0.5s;
    pointer-events: none;
}

.box:hover:before {
    left: -130%;
}


.box .content {
    // position: absolute;
    // top: 15px;
    // left: 15px;
    // right: 15px;
    // bottom: 15px;
    border: 1px solid rgba(240, 165, 145, .4);
    padding: 0;
    margin: 10px;
    // text-align: center;
    box-shadow: 0 5px 10px rgba(9, 0, 0, 0.5);

}

.box span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    box-sizing: border-box;

}

.box span:nth-child(1) {
    transform: rotate(0deg);
}

.box span:nth-child(2) {
    transform: rotate(90deg);
    right: 0;
    left: auto;
}

.box span:nth-child(3) {
    transform: rotate(180deg);
}

.box span:nth-child(4) {
    transform: rotate(270deg);
}

.box span:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background: #50dfdb;
    animation: animate 4s linear infinite;
}

@keyframes animate {
    0% {
        transform: scaleX(0);
        transform-origin: left;
    }

    50% {
        transform: scaleX(1);
        transform-origin: left;
    }

    50.1% {
        transform: scaleX(1);
        transform-origin: right;

    }

    100% {
        transform: scaleX(0);
        transform-origin: right;

    }


}
</style>