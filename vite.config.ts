import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"
import eslintPlugin from "vite-plugin-eslint"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		eslintPlugin({
			include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"],
		}),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
	base: "./package", // 打包路径
	server: {
		//设置 server.hmr.overlay 为 false 可以禁用开发服务器错误的屏蔽
		hmr: { overlay: false },
		port: 4000,
		open: true, // 服务启动时自动打开浏览器
		cors: true, // 允许跨域
	},
})
