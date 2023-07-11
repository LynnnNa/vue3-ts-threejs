import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/building",
		name: "Building",
		component: () => import("@/views/ZHSQ/building.vue"),
	},
	{
		path: "/wg",
		name: "Wg",
		component: () => import("@/views/Wg/index.vue"),
	},
	{
		path: "/zhsq",
		name: "Zhsq",
		component: () => import("@/views/ZHSQ/ZHSQ.vue"),
	},
	{ path: "/", redirect: { name: "Zhsq" } },
]
const router = createRouter({
	history: createWebHashHistory(),
	routes,
})
export default router
