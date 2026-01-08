
# 🚀 NutriTrack Pro - APK 离线包打包指南

要将此 Web 项目转换为手机上可直接安装的 `.apk` 文件，请遵循以下专业路径：

### 1. 环境准备 (必要条件)
- 安装 [Node.js](https://nodejs.org/) (推荐 LTS 版本)
- 安装 [Android Studio](https://developer.android.com/studio)
- 在 Android Studio 中安装 SDK Platform (建议 API 30+)

### 2. 初始化 Capacitor 容器
在项目根目录下运行：
```bash
# 安装核心依赖
npm install @capacitor/core @capacitor/cli

# 初始化项目 (App 名称: NutriTrack Pro)
npx cap init "NutriTrack Pro" com.nutritrack.app --web-dir dist

# 安装 Android 平台插件
npm install @capacitor/android
npx cap add android
```

### 3. 生成编译文件
```bash
# 1. 编译 Web 代码 (如果您使用 Vite/Webpack)
npm run build

# 2. 将代码同步到 Android 工程
npx cap copy android
```

### 4. 生成 APK (关键步骤)
1. 运行 `npx cap open android`，这会自动打开 **Android Studio**。
2. 等待 Gradle 同步完成（右下角进度条消失）。
3. 在顶部菜单栏选择：**Build > Build Bundle(s) / APK(s) > Build APK(s)**。
4. 编译完成后，点击右下角的 **"locate"** 弹窗，即可找到生成的 `app-debug.apk`。

### 5. 关于图标 (Icons)
- 您可以使用本 App 中“个人档案”页面展示的图标作为素材。
- 将图片放入 Android 工程的 `app/src/main/res/mipmap` 目录下即可替换启动图标。

### 6. 注意事项
- **离线运行**: 本应用的大部分功能（计算、本地建议）均支持完全离线运行。
- **权限**: 默认已在 `metadata.json` 中声明相机权限（用于未来可能的条码扫描）。
