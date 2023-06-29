import type { EChartsOption } from 'echarts'
import { unref, nextTick, watch, computed, ref, Ref } from 'vue'
import echarts from '/@/utils/lib/echarts'
import { useDebounceFn } from '@vueuse/core';
import { useEventListener } from '/@/hooks/event/useEventListener';
import { useBreakpoint } from '/@/hooks/event/useBreakpoint';
import { useTimeoutFn } from '/@/hooks/core/useTimeout';
// import { useRootSetting } from '/@/hooks/setting/useRootSetting';
// import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

export function useECharts(elRef: Ref<HTMLDivElement>, theme: 'light' | 'dark' | 'default' = 'default') {
	let chartInstance: echarts.ECharts | null = null
  // const { getDarkMode: getSysDarkMode } = useRootSetting();
  // const { getCollapsed } = useMenuSetting();

  // const getDarkMode = computed(() => {
  //   return theme === 'default' ? getSysDarkMode.value : theme;
  // });
  let removeResizeFn: Fn = () => {};
  let resizeFn: Fn = resize
  resizeFn = useDebounceFn(resize, 200)
  const cacheOptions = ref({}) as Ref<EChartsOption>;
	function initCharts(t = theme) {
		const el = unref(elRef)
		if (!el || !unref(el)) {
			return
		}
		chartInstance = echarts.init(el, t)
		const { removeEvent } = useEventListener({
			el: window,
			name: 'resize',
			listener: resizeFn,
		})
		removeResizeFn = removeEvent
		const { widthRef, screenEnum } = useBreakpoint()
		if (unref(widthRef) <= screenEnum.MD || el.offsetHeight === 0) {
			useTimeoutFn(() => {
				resizeFn()
			}, 30)
		}
	}
  const getOptions = computed(() => {
    // if (getDarkMode.value !== 'dark') {
    //   return cacheOptions.value as EChartsOption;
    // }
    return {
      backgroundColor: 'transparent',
      ...cacheOptions.value,
    } as EChartsOption;
  });
  function setOptions(options: EChartsOption, clear = true) {
    cacheOptions.value = options;
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions));
      }, 30);
      return;
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts('default');

          if (!chartInstance) return;
        }
        clear && chartInstance?.clear();

        chartInstance?.setOption(unref(getOptions));
      }, 30);
    });
  }
  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn',
      },
    });
  }
	return {
    setOptions
  }
}
