import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		eslintPlugin({
			include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"]
		})
	],
	resolve: {
		alias: {
			//这是一个对象吧！它得有键跟键名吧！
			"@": resolve(__dirname, "src")
		}
	},
	base: "./package", // 打包路径
	server: {
		port: 4000,
		open: true, // 服务启动时自动打开浏览器
		cors: true // 允许跨域
	}
})
