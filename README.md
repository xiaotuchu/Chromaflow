# Chromaflow

Chromaflow 是一个面向绘画初学者和视觉学习者的色彩匹配练习网站。它完全在浏览器中运行，不需要账号，也不依赖应用后端。

## 功能

- 支持 HSV、RGB 和 HSL 三种色彩模式的匹配练习。
- 随机生成目标色，也可通过调色板和本地图片取色设置目标色。
- 提交后提供评分、色相、饱和度和明度差异分析。
- 自动在当前浏览器保存最近 50 次练习记录，可按提交模式查看、下载 CSV 或清空记录。
- 重新进入练习页时恢复最近一次提交的练习结果。
- 提供中英文界面和色彩知识库内容。

图片仅在浏览器本地处理，不会上传到服务器。

## 技术栈

- TypeScript
- React 19
- Vite 7
- Tailwind CSS 3
- React Router（HashRouter）

## 本地运行

需要 Node.js 20.19+ 或 22.12+。

```sh
npm ci
npm run dev
```

开发服务器默认地址为 `http://127.0.0.1:3000`。

## 检查与构建

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

生产构建产物位于 `dist/`。

## 本地数据

练习记录保存在浏览器 localStorage 中，最多保留最近 50 条。记录包含提交时间、色彩模式、目标色和匹配色，不包含图片。

数据只存在当前浏览器和当前网站地址下：更换浏览器、设备、域名或端口后不会共享；清除浏览器站点数据后无法恢复。练习历史页可下载 CSV 作为本地备份。

## GitHub Pages 部署

仓库已包含 GitHub Pages 工作流：[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)。

1. 将代码推送到 `main` 分支。
2. 在 GitHub 仓库中打开 **Settings → Pages**。
3. 将发布来源设为 **GitHub Actions**。
4. 等待 **Deploy GitHub Pages** 工作流完成。

项目页面通常可通过以下地址访问：

```text
https://<GitHub 用户名>.github.io/<仓库名>/#/zh/
```

该项目使用 HashRouter，因此适合部署在 GitHub Pages 等静态托管服务中。

## 联系邮箱

默认联系邮箱为 `chromaflow@xiaotu.asia`。如需替换，可在构建环境中设置：

```text
VITE_CONTACT_EMAIL=your-email@example.com
```

该变量会打包到前端，请勿放入密码、令牌或其他密钥。
