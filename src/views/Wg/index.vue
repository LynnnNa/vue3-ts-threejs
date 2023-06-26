<template>
    <div>
        <div>
            <div>单元数<input type="number" v-model="uNum" min="1" max="10" /></div>
            <div>楼层数<input type="number" v-model="fNum" min="1" max="10" /></div>
        </div>
        <button @click="buildingDetail">
            查看楼栋模型
        </button>
        <button v-show="showWindow" @click="closeWindow">
            关闭模型
        </button>
        <div class="b-window" :style="wStyle" :class="{ 'block': showWindow }">
            <iframe v-if="src" :src="src" class="iframe"></iframe>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
    name: "Wg",
    setup() {
        let showWindow = ref(false)
        let src = ref()
        let uNum = ref(4)
        let fNum = ref(7)
        const wStyle = {
            width: `${window.innerWidth - 100}px`,
            height: `${window.innerHeight - 100}px`
        }
        function buildingDetail() {
            console.log('111')
            if (uNum.value > 10) {
                alert('单元数请不要超过10')
                return
            }
            if (fNum.value > 10) {
                alert('楼层数请不要超过10')
                return
            }
            if (!showWindow.value) closeWindow()
            setTimeout(() => {
                showWindow.value = true
                src.value = `#/zhsq?u=${uNum.value}&f=${fNum.value}`
            }, 1000);
        }
        function closeWindow() {
            showWindow.value = false
            src.value = null
        }
        return {
            wStyle,
            showWindow,
            buildingDetail,
            closeWindow,
            uNum,
            fNum,
            src
        }
    }
})
</script>
<style lang="scss">
.b-window {
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
    display: none;

    &.block {
        display: block
    }

    .iframe {
        width: 100%;
        height: 100%
    }
}
</style>