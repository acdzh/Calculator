# 项目梳理报告（Calculator）

## 1. 项目概览

这是一个网页端计算器应用，界面与交互风格模仿 Windows 10 计算器（部分功能）。应用基于 React 构建，使用 react-uwp 提供 UWP/Fluent 风格组件，并通过 React Router 提供多页面（模块）切换。

入口与路由由 [App.js](file:///workspace/src/App.js) 与 [index.js](file:///workspace/src/index.js) 负责：侧边栏（NavigationView）提供模块入口，主区域通过路由渲染对应计算器页面。

## 2. 功能模块

- 标准计算器：四则运算、百分号、平方/开方、取倒数、正负号、退格、清空、内存寄存（MC/MR/MS/M+/M-）。实现见 [Standard.jsx](file:///workspace/src/Component/Standard.jsx)。
- 科学计算器：支持括号、更多一元/二元运算、三角/双曲函数、阶乘等；维护“词组栈”（historyStack）保存中间表达式，并将其映射为 JS/Math 表达式后用 `eval` 求值。实现见 [Scientific.jsx](file:///workspace/src/Component/Scientific.jsx)。
- 日期计算器：支持“日期差（两日期相差多少周/天）”与“日期加减（在某日期基础上加/减年/月/日）”。实现见 [Date.jsx](file:///workspace/src/Component/Date.jsx)。
- 设置：支持主题（深/浅）、是否启用 Fluent、强调色、背景图（URL 或上传），并用 localStorage 持久化，部分操作通过刷新页面生效。实现见 [Setting.jsx](file:///workspace/src/Component/Setting.jsx)。
- 关于：展示项目说明文档内容与技术栈信息，内容来源见 [about.md](file:///workspace/src/about.md)，页面实现见 [About.jsx](file:///workspace/src/Component/About.jsx)。

## 3. 技术栈与依赖

依赖定义见 [package.json](file:///workspace/package.json)。

- React 16.13.1 / ReactDOM 16.13.1
- react-router / react-router-dom 5.2.0
- react-scripts 3.4.1（Create React App 工具链）
- react-uwp 1.3.2（UWP 风格组件库）
- @testing-library/*（测试）

## 4. 目录结构（关键）

- public/：静态资源与入口 HTML（CRA 标准结构）
- src/
  - index.js：渲染入口、Theme 注入、Router 绑定 history、从 localStorage 读取主题配置
  - App.js：NavigationView + 路由表（/standard、/scientific、/date、/setting、/about）
  - Component/：各功能模块与 UI 组件
  - App.css / index.css：样式
- test/：CRA 测试用例与测试初始化
- img/：README 展示用截图

## 5. 关键实现说明

### 5.1 路由与布局

- 侧边栏导航节点由 `navigationTopNodes` / `navigationBottomNodes` 生成，底层为 `Link + SplitViewCommand`。
- 路由切换由 `Switch + Route` 实现，默认 `/` 指向标准计算器。见 [App.js](file:///workspace/src/App.js)。

### 5.2 主题与持久化

- [index.js](file:///workspace/src/index.js) 使用 `Theme` 包裹应用，并从 localStorage 读取：
  - theme-name（light/dark）
  - theme-accent（强调色）
  - use-fluent（是否启用 Fluent）
  - theme-bg（背景图 URL 或 dataURL）
- 设置页对部分配置通过 `window.location.reload()` 强制生效（例如主题模式/背景图）。见 [Setting.jsx](file:///workspace/src/Component/Setting.jsx)。

### 5.3 科学计算器求值策略

- 通过 `historyStack` 保存表达式词组（数字、操作符、括号与函数名）。
- `calcDic` 将词组映射为 JS 可执行形式（例如 `ln -> Math.log`，`^ -> **` 等），最终 `eval(s.join(''))` 求值。见 [Scientific.jsx](file:///workspace/src/Component/Scientific.jsx)。
- 这种方式实现成本低，但依赖 `eval`，且对异常/非法表达式主要以 try/catch 返回 `error` 兜底。

## 6. 本地运行方式

- 安装依赖：`npm install`
- 启动开发服务器：`npm run start`
- 构建静态文件：`npm run build`
- 运行测试：`npm test`（在 CI 环境会自动以非 watch 方式运行）

## 7. 风险与限制（来自现状）

- 依赖 `eval` 进行表达式求值（科学计算器）：当前表达式由 UI 组装，通常不直接暴露用户输入脚本，但仍属于相对高风险实现方式。
- 代码中存在 `console.log` 调试输出，可能影响控制台噪声与性能（不影响功能）。
- 未提供锁文件（yarn.lock/package-lock.json），不同机器安装依赖可能产生版本漂移。

