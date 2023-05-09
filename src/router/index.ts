import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/demo",
		name: "Demo",
		component: () => import("@/views/ThreeDemo/ThreeDemo.vue"),
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("@/views/Home.vue"),
	},
	{ path: "/", redirect: { name: "Demo" } },
]
const router = createRouter({
	history: createWebHashHistory(),
	routes,
})
export default router
