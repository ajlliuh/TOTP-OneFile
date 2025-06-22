# TOTP 管理器

一个安全的双因素认证令牌管理器，支持离线使用的PWA应用。

## ✨ 功能特性

- 🔐 **安全的TOTP令牌生成** - 支持Google Authenticator、Microsoft Authenticator等标准
- 📱 **PWA支持** - 可安装到桌面和移动设备，支持离线使用
- 🌙 **深色/浅色主题** - 自动适应系统主题偏好
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🔍 **搜索和过滤** - 快速找到需要的令牌
- 📷 **二维码扫描** - 支持扫描二维码快速添加令牌
- 💾 **数据备份** - 支持导入/导出备份文件
- 🔄 **自动同步** - 数据自动保存到本地存储

## 🚀 快速开始

### 在线使用
访问 [https://2fa-m7b.pages.dev/](https://2fa-m7b.pages.dev/)

### 本地运行
1. 克隆项目
```bash
git clone https://github.com/your-username/totp-manager.git
cd totp-manager
```

2. 启动本地服务器
```bash
# 使用Python
python -m http.server 8080

# 或使用Node.js
npx http-server -p 8080
```

3. 打开浏览器访问 `http://localhost:8080`

## 📱 安装PWA

### 桌面端
1. 在Chrome/Edge中访问应用
2. 点击地址栏右侧的"安装"按钮
3. 或按F12打开开发者工具，在Application标签页点击"Install"

### 移动端
1. 在Safari/Chrome中访问应用
2. 点击分享按钮，选择"添加到主屏幕"
3. 应用将出现在主屏幕上

## 🔧 技术栈

- **前端框架**: Vue.js 3
- **UI组件**: Bootstrap 5
- **图标**: Bootstrap Icons (SVG)
- **加密**: CryptoJS
- **二维码**: jsQR (扫描) + kjua (生成)
- **PWA**: Service Worker + Web App Manifest
- **存储**: LocalStorage

## 📁 项目结构

```
totp-manager/
├── index.html          # 主页面
├── manifest.json       # PWA配置
├── sw.js              # Service Worker
├── pwa.js             # PWA管理器
├── icons/             # 应用图标
│   └── icon.svg
├── libs/              # 本地库文件
│   ├── vue.global.prod.js
│   ├── bootstrap.min.css
│   ├── bootstrap.bundle.min.js
│   ├── crypto-js.min.js
│   ├── jsQR.js
│   └── kjua.min.js
└── README.md
```

## 🔐 安全说明

- 所有数据仅存储在本地，不会上传到服务器
- 使用AES加密保护敏感数据
- 支持密码保护功能
- 完全离线运行，保护隐私

## 🌟 主要功能

### 令牌管理
- 添加、编辑、删除TOTP令牌
- 支持自定义令牌名称和图标
- 批量操作支持

### 二维码功能
- 扫描二维码快速添加令牌
- 生成令牌二维码用于分享
- 支持摄像头扫描

### 数据备份
- 导出加密备份文件
- 导入备份文件恢复数据
- 支持多种备份格式

### 用户体验
- 实时倒计时显示
- 一键复制验证码
- 搜索和过滤功能
- 多选模式操作

## 📄 许可证

MIT License

## 🙏 致谢

- [RFC 6238](https://tools.ietf.org/html/rfc6238) - TOTP标准规范
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Bootstrap](https://getbootstrap.com/) - CSS框架
- [CryptoJS](https://cryptojs.gitbook.io/) - HMAC-SHA1加密算法实现
- [jsQR](https://github.com/cozmo/jsQR) - 二维码扫描
- [kjua](https://github.com/lrsjng/kjua) - 二维码生成 