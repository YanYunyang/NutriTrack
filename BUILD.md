
# 营养管理 App 发布指南 (Execution Path)

本项目是一个标准的 React SPA。若要将其打包发布为移动 App，推荐以下路径：

### 1. 移动端封装 (Capacitor)
这是将 Web 应用转换为原生 iOS/Android 应用最主流且简单的方式。

**步骤：**
1.  **准备环境**: 安装 Node.js 并确保 React 项目能够正常 `npm run build`。
2.  **添加 Capacitor**:
    ```bash
    npm install @capacitor/core @capacitor/cli
    npx cap init NutriTrack com.yourname.nutritrack
    ```
3.  **构建 Web 代码**: `npm run build` (确保 `dist` 或 `build` 文件夹生成)。
4.  **添加平台**:
    ```bash
    npm install @capacitor/android @capacitor/ios
    npx cap add android
    npx cap add ios
    ```
5.  **同步并打开**:
    ```bash
    npx cap copy
    npx cap open android # 将启动 Android Studio
    npx cap open ios     # 将启动 Xcode
    ```
6.  **在原生工具中签名并发布**。

### 2. 离线缓存 (PWA)
如果您不想上架应用商店，可以配置为 Progressive Web App。

**步骤：**
1.  **Service Worker**: 引入 `vite-plugin-pwa` (如果使用 Vite) 或 `workbox`。
2.  **Manifest**: 完善 `public/manifest.json`，定义图标、启动色和独立显示模式 (`display: standalone`)。
3.  **HTTPS 部署**: 部署到 Vercel 或 Netlify 即可通过浏览器“添加到主屏幕”安装。

### 3. 注意事项
- **API Key**: 生产环境应通过后端代理 Gemini 请求，或使用环境变量。
- **持久化**: 目前代码使用 `localStorage`，在 App 模式下效果良好，但大规模数据建议升级到 `IndexedDB`。
