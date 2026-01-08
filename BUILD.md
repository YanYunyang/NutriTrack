
# 🇨🇳 NutriTrack Pro 中国市场 App 发布深度指南

要在中国市场将此 Web 项目成功发布为真正的 App (APK/IPA)，请遵循以下合规与技术路径：

### 1. 技术底座：Capacitor
本应用推荐使用 [Capacitor](https://capacitorjs.com/) 进行跨平台封装，因为它对 Web 原生支持极佳且性能稳定。

### 2. 中国市场合规 Checklist (必做)
- [ ] **App 备案 (强制)**: 2023年新规。需在域名所在的云服务商（腾讯云/阿里云等）后台提交 App 备案信息。
- [ ] **软件著作权 (软著)**: 申请主体需与备案主体一致。上架华为、小米、酷安等商店的必备文件。
- [ ] **隐私合规检测**: 
    - 启动时必须弹出《用户协议》和《隐私政策》。
    - 用户点击“同意”前，严禁调用敏感权限（如 Camera、Storage）。
- [ ] **域名与服务器**: 
    - 如果涉及 API 调用，后端服务器必须在中国境内，且域名必须完成 ICP 备案。
    - **本 App 核心逻辑为离线运行，若无需云同步，可忽略服务器备案，但 App 自身仍需备案。**

### 3. 打包与分发流程
1. **生成 APK**:
   ```bash
   npm install @capacitor/android
   npx cap add android
   npm run build
   npx cap copy android
   ```
2. **应用加固 (Hardening)**: 
   下载生成的 `app-release.apk` 后，使用 **360加固保** 或 **腾讯御安全** 进行加固，这是许多商店审核的硬性要求。
3. **签名 (Signing)**: 
   使用 Java 的 `keytool` 生成您的专属 `.keystore` 签名文件，并在 Android Studio 中完成 V2 签名。

### 4. 推荐上架平台
- **安卓**: 华为应用市场、小米应用商店、Vivo/Oppo 商店。
- **极客社区**: 酷安 (Coolapk) —— 适合无软著初期小范围测试。
- **iOS**: Apple App Store (需 $99/年的开发者账号)。

### 5. 图标替换
请将 `android/app/src/main/res/` 下各分辨率的图标替换为您设计的 512x512 高清素材。
