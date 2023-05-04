# vue3

## 安装依赖
```
pnpm install
```

### 运行项目
```
pnpm run serve
```
### 在浏览器中打开 http://localhost:8080 查看项目运行情况

### 项目结构
```
|-- public
|   |-- index.html            // 入口 HTML 文件
|-- src
|   |-- assets                // 资源文件
|   |-- components            // 组件文件夹
|   |-- main.ts               // 项目入口文件
|   |-- router.ts             // 路由配置文件
|   |-- store.ts              // 状态管理文件
|   |-- views                 // 视图文件夹
|   |   |-- Home.vue          // 主页视图文件
|-- package.json              // 依赖配置文件
|-- tsconfig.json             // TypeScript 配置文件
|-- README.md                 // 项目说明文件
```

### 技术栈
- Vue3：构建用户界面的渐进式框架
- TypeScript：JavaScript 的超集，提供静态类型检查
- Three.js：基于 WebGL 的 JavaScript 3D 库

### 项目说明

本项目主要使用 Vue3 和 TypeScript，结合 Three.js 库进行开发。其中，Vue3 提供了强大的组件化开发能力，TypeScript 则提供了代码静态类型检查，使代码更加健壮；而 Three.js 则提供了基于 WebGL 的 3D 图形渲染能力。

项目包含了一个主页视图，其中使用 Three.js 实现了一个简单的 3D 场景展示。使用 Vue3 进行组件化开发，将 Three.js 中的场景封装为 Vue3 组件，并将场景中的物体作为组件的子组件进行展示。

在开发过程中，需要注意以下几点：

- 使用 TypeScript 进行开发，并编写完善的类型定义文件，以提高代码健壮性和可维护性。
- 遵循 Vue3 组件化开发的规范，将业务逻辑和视图进行分离。
- 尽量避免在组件生命周期函数中进行复杂的 Three.js 场景操作，可以将场景操作封装为方法进行调用，从而提高组件的复用性和可维护性。
- 在 Three.js 中，需要注意场景、相机和渲染器的概念，了解它们的基本使用方法以及常用的设置参数。
- 在 Three.js 中，需要注意场景中物体的位置、旋转、缩放等属性，以及材质、纹理等概念。熟练掌握这些基本概念，能够更好地进行场景的搭建和渲染。
- 在项目中，可以使用 Vue3 的生命周期函数和 Three.js 的动画循环函数进行场景的更新和渲染。
- 在组件中使用 Three.js 库时，需要注意在组件销毁时进行资源的清理和释放，避免出现内存泄漏的问题。

### 参考资料

- Vue3 官方文档：https://v3.cn.vuejs.org/
- TypeScript 官方文档：https://www.typescriptlang.org/docs/
- Three.js 官方文档：https://threejs.org/docs/
- Three.js 入门教程：https://www.w3cschool.cn/threejs/
