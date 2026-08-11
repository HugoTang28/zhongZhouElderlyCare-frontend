# 中州养老管理系统 - 管理后台前端

中州养老管理系统（ZhongZhou Elderly Care）管理后台前端，基于 Vue 3 + Vite + Element Plus 构建。

## 技术栈

- **Vue 3** —— 渐进式 JavaScript 框架
- **Vite** —— 前端构建工具与开发服务器
- **Vue Router 4** —— 前端路由
- **Pinia** —— 状态管理
- **Element Plus** —— UI 组件库
- **Axios** —— HTTP 请求
- **js-cookie** —— Cookie 操作
- **NProgress** —— 路由加载进度条
- **Sass** —— CSS 预处理器

## 环境要求

- Node.js >= 18
- 包管理器：npm（或 pnpm / yarn）

## 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产环境代码
npm run build

# 本地预览构建产物
npm run preview
```

## 目录结构

```
zzyl-frontend/
├── src/
│   ├── api/          # 接口请求封装
│   ├── layout/       # 页面布局组件
│   ├── router/       # 路由配置
│   ├── store/        # Pinia 状态管理
│   ├── styles/       # 全局样式
│   ├── utils/        # 工具函数
│   ├── views/        # 页面视图组件
│   ├── App.vue       # 根组件
│   ├── main.js       # 入口文件
│   └── permission.js # 路由权限拦截
├── index.html
├── package.json
└── vite.config.js
```

## 说明

本项目为管理后台前端，通过 `src/permission.js` 进行路由权限拦截，接口请求统一在 `src/api` 中封装。
