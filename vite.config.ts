import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // resolve: {
    //   alias :{  //这是一个对象吧！它得有键跟键名吧！
    //    "@": path.resolve(__dirname, "src"),
    //  }
    ],
})
