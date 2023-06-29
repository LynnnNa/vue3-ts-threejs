<template>
    <div ref="chartRef" :style="{ width, height }"></div>
</template>
<script lang="ts" setup>
import { Ref, ref, watch } from 'vue';
import * as echarts from "echarts";
import type { EChartsOption } from 'echarts';
import { useECharts } from '/@/hooks/web/useECharts';
const props = defineProps({
    loading: Boolean,
    width: {
        type: String as PropType<string>,
        default: '100%',
    },
    height: {
        type: String as PropType<string>,
        default: '300px',
    },
});
const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
watch(
    () => props.loading,
    () => {
        if (props.loading) {
            return;
        }
        setOptions({
            title:{
                text:'人口信息',
                textStyle:{
                    fontSize: 14,
                    // color: '#0791fe'
                    color: '#50dfdb'
                }
            },
            legend: {
                textStyle:{
                    color: '#fff'
                },
                bottom: 0,
                // right: 0,
                data: ['男', '女'],
            },
            tooltip: {},
            radar: {
                radius: '50%',
                splitNumber: 5,
                indicator: [
                    {
                        name: '常住',
                        color:'#fff'
                    },
                    {
                        name: '户籍',
                    },
                    {
                        name: '流动',
                        color:'#fff'
                    },
                    {
                        name: '境外',
                    },
                    {
                        name: '未落户',
                    }
                ],
            },
            series: [
                {
                    type: 'radar',
                    symbolSize: 0,
                    areaStyle: {
                        shadowBlur: 0,
                        shadowColor: 'rgba(0,0,0,.2)',
                        shadowOffsetX: 0,
                        shadowOffsetY: 10,
                        opacity: 1,
                    },
                    data: [
                        {
                            value: [90, 76, 7, 4, 3],
                            name: '男',
                            itemStyle: {
                                color: 'rgba(90, 177, 239, .6)',
                            },
                        },
                        {
                            value: [70, 60, 5, 1, 2],
                            name: '女',
                            itemStyle: {
                                color: '#b6a2de',
                            },
                        },
                    ],
                },
            ],
        });
    },
    { immediate: true },
);
</script>
  