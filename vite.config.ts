import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'

function pathResolve(dir: string) {
	return resolve(process.cwd(), '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		// eslintPlugin({
		// 	include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"],
		// }),
	],
	resolve: {
		alias: [
			// {
			// 	'@': resolve(__dirname, 'src'),
			// },
			{
				find: /@\//,
				replacement: pathResolve('src') + '/',
			},
			{
				find: /\/@\//,
				replacement: pathResolve('src') + '/',
			},
			// /#/xxxx => types/xxxx
			{
				find: /\/#\//,
				replacement: pathResolve('types') + '/',
			},
		],
	},
	base: './package', // 打包路径
	server: {
		//设置 server.hmr.overlay 为 false 可以禁用开发服务器错误的屏蔽
		hmr: { overlay: false },
		port: 4000,
		open: false, // 服务启动时自动打开浏览器
		cors: true, // 允许跨域
	},
})
