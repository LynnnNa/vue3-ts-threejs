<template>
    <div class="border__shadow">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
// import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
</script>
<style lang="scss">
// var

$color-base: #2c3e50;
$color-border: #fff;

$w: 200px;
$h: 350px;

.border__shadow {
    background: $color-border;
    cursor: pointer;
    position: relative;
    margin: 2%;
    line-height: $h;
    text-align: center;
    width: $w;
    height: $h;
    overflow: hidden; // important
    transition: background 350ms 600ms ease-in-out;

    &:hover {
        background: $color-base;
        transition-delay: 0ms;
    }

    &:hover>span {
        color: $color-border;
        transition-delay: 0ms;
    }

    &::after {
        box-shadow: // top

            0 ((-$h)+2) 0 0.0619em $color-border,
            ($w)+2 ((-$h)+2) 0 0 transparent,
            $w*2 (
            (-$h)+2) 0 0 $color-border,

            // right

            (($w)-2) 0 0 0 $color-border,
            (($w)-2) $h 0 transparent,
            (($w)-2) $h*2 0 $color-border,

            // left

            ((-$w)+2) (-$h)*2 0 $color-border,
            ((-$w)+2) (-$h) 0 0 transparent,
            ((-$w)+2) 0 0 0 $color-border,

            // bottom

            (-$w)*2 (($h)-2) 0 0 $color-border,
            (-$w)*2 (($h)-2) 0 0 transparent,
            0 (($h)-2) 0 0.0619em $color-border;


        content: "";
        position: absolute;
        top: 1px;
        left: 1px;
        width: ($w)-2;
        height: ($h)-2;
        transition: box-shadow 950ms ease-in-out;
    }

    &:hover::after {
        box-shadow: // top

            (-$w)*2 ((-$h)+2) 0 0 $color-border,
            (-$w)*2 ((-$h)+2) 0 0 transparent,
            0 ((-$h)+2) 0 0.0619em $color-border,

            // right

            (($w)-2) (-$h)*2 0 $color-border,
            (($w)-2) (-$h) 0 transparent,
            (($w)-2) 0 0 $color-border,

            // left

            ((-$w)+2) 0 0 $color-border,
            ((-$w)+2) $h 0 transparent,
            ((-$w)+2) $h*2 0 $color-border,

            // bottom

            0 (($h)-2) 0 0.0619em $color-border,
            ($w)+2 (($h)-2) 0 0 transparent,
            $w*2 (
            ($h)-2) 0 0 $color-border;
    }

    &::before {
        border: 2px solid $color-base;
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        width: ($w
        );
    height: ($h);
}

>span {
    color: $color-base;
    font-weight: 500;
    letter-spacing: 4px;
    transition: color 350ms 600ms ease-in-out;
}
}

// GENERAL

*,
*:after,
*:before {
    box-sizing: border-box;
}

html,
body {
    width: 100%;
    height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizelegibility;
}

body {
    background: $color-base;
    font-family: 'Roboto', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>