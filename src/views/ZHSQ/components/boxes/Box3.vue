
<template>
  <div class="svg-wrapper" :style="{ width: width + 'px' }">
    <svg height="60" :width="width" xmlns="http://www.w3.org/2000/svg">
      <rect class="shape" height="60" :width="width" />
    </svg>
    <div class="text">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
// emits:[click],
defineProps({
  width: {
    type: Number,
    default: 220
  },
})
</script>

<style lang="scss" scoped>
.svg-wrapper {
  position: relative;
  // top: 50%;
  // transform: translateY(-50%);
  margin: 0 auto;
  height: 60px;
  overflow: hidden;
  cursor: pointer;
}

.shape {
  stroke-dasharray: 120 165;
  stroke-dashoffset: -333;
  stroke-width: 4px;
  fill: transparent;
  stroke: #19f6e8;
  border-bottom: 5px solid black;
  transition: stroke-width 1s, stroke-dashoffset 1s, stroke-dasharray 1s;
}

.text {
  font-family: 'Roboto Condensed';
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 8px;
  color: #fff;
  top: -48px;
  position: relative;
  text-align: center
}

.svg-wrapper:hover .shape {
  stroke-width: 2px;
  stroke-dashoffset: 0;
  stroke-dasharray: 760;
}
</style>