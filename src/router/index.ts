import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/demo",
		name: "Demo",
		component: () => import("@/views/ThreeDemo/ThreeDemo.vue"),
	},
	{
		path: "/cube",
		name: "Cube",
		component: () => import("@/views/GeometryCube/GeometryCube.vue"),
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
