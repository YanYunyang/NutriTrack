
# 🇨🇳 NutriTrack Pro 中国市场 App 发布指南

### 1. 离线安装包 (APK)
按照上述 Capacitor 流程生成的 `app-debug.apk` 可以在安卓手机上直接通过微信或浏览器发送并安装。

### 2. 商店上架三要素 (必备)
- **软著 (Software Copyright)**: 搜索“中国版权保护中心”在线申请，或找代理加速。
- **App 备案**: 在您的云服务商（腾讯云、阿里云等）后台提交 App 备案信息。
- **隐私保护指引**: 应用首次启动必须弹出隐私政策确认框。

### 3. 图标替换位置
生成的 Android 工程中，图标文件位于：
`android/app/src/main/res/mipmap-xxxx/`
请使用 512x512 的设计稿替换这些默认图标。

### 4. 本地离线逻辑
本 App 采用 LocalStorage 进行存储，打包为 APK 后，数据会持久化在 App 内部存储空间中，除非卸载 App，否则数据不会丢失。
