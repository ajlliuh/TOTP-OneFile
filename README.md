# TOTP 管理器（纯前端单文件版）

一个高体验、兼容移动端和 PC 端的 TOTP（时间同步一次性密码）管理器，支持本地存储、二维码识别/生成、批量导入导出、GitHub Gist 云端同步、WebDAV 云端备份等功能。无需后端，数据仅存储在本地或用户云端，安全高效。

## 功能特性
- 本地 TOTP 令牌管理（增删查改）
- 支持 Base32 密钥
- 二维码识别/生成（导入导出）
- JSON 批量导入导出
- GitHub Gist 云端同步（PAT 令牌）
- WebDAV 云端备份/恢复
- 响应式布局，移动端极简，PC 端功能丰富
- 一键复制动态码

## 使用方法
1. 打开 `index.html` 即可使用，无需部署后端。
2. 支持本地浏览器直接打开或通过 GitHub Pages、Cloudflare Pages 托管访问。
3. 移动端仅支持基础展示和复制，PC 端支持完整管理功能。
4. WebDAV 备份/恢复：首次使用时输入 WebDAV 服务器、用户名、密码和文件名，信息本地保存。

## GitHub Gist 云端同步
- 需在 GitHub 生成 [Personal Access Token](https://github.com/settings/tokens)（勾选 gist 权限）。
- 在设置中输入 PAT 后可一键备份/恢复数据到 Gist。

## WebDAV 云端备份/恢复
- 支持坚果云、Nextcloud、阿里云盘等主流 WebDAV 服务。
- 仅需输入 WebDAV 服务器地址、用户名、密码和备份文件名。
- 数据以 JSON 文件形式上传/下载，安全私密。

## 技术要点
- 纯前端实现，无依赖后端
- TOTP 算法、Base32 编解码
- 二维码识别（jsQR）、生成（kjua）
- 本地存储、JSON 导入导出
- WebDAV 标准协议云端同步
- 响应式 UI 设计，适配移动端与 PC 端

## 部署到 GitHub Pages
1. 上传 `index.html` 到你的仓库主分支（如 main）。
2. 在仓库 Settings → Pages，选择 main 分支和根目录，保存。
3. 稍等片刻即可通过 GitHub Pages 链接访问。

## 部署到 Cloudflare Pages
1. 注册并登录 [Cloudflare](https://pages.cloudflare.com/)。
2. 新建一个 Pages 项目，选择你的 GitHub 仓库。
3. 构建设置中，Build command 留空，Output directory 设为 `./`（根目录）。
4. 部署后即可获得全球加速的访问链接。

### Cloudflare Pages 优点
- **全球 CDN 加速**：自动分发到全球各地节点，访问速度快。
- **永久免费**：个人和小型项目无需付费。
- **自动化部署**：每次推送到 GitHub 自动触发部署，无需手动操作。
- **无需服务器**：纯前端静态托管，无需维护后端。
- **自定义域名**：可绑定自己的域名，支持 HTTPS。

---

> 本项目为纯前端单文件实现，适合个人自用或开源分享。数据仅存储于本地或用户自己的云端，安全私密。

<details>
<summary>English Version (Click to expand)</summary>

# TOTP Manager (Pure Frontend Single File)

A high-experience, mobile & PC compatible TOTP (Time-based One-Time Password) manager. Supports local storage, QR code scan/generation, batch import/export, GitHub Gist cloud sync, WebDAV cloud backup, all in a single HTML file. No backend, data is only stored locally or in your own cloud, safe and efficient.

## Features
- Local TOTP token management (CRUD)
- Base32 key support
- QR code scan/generation (import/export)
- JSON batch import/export
- GitHub Gist cloud sync (PAT token)
- WebDAV cloud backup/restore
- Responsive UI: minimal on mobile, full features on PC
- One-click copy OTP

## Usage
1. Open `index.html` directly, no backend required.
2. Use in browser locally or deploy via GitHub Pages/Cloudflare Pages.
3. Mobile: basic display & copy; PC: full management features.
4. WebDAV backup/restore: enter WebDAV server, username, password, and filename on first use. Info is saved locally.

## GitHub Gist Cloud Sync
- Generate a [Personal Access Token](https://github.com/settings/tokens) on GitHub (with gist permission).
- Enter PAT in settings to backup/restore data to your Gist.

## WebDAV Cloud Backup/Restore
- Supports mainstream WebDAV services such as Nutstore, Nextcloud, Aliyun Drive, etc.
- Just enter WebDAV server address, username, password, and backup filename.
- Data is uploaded/downloaded as a JSON file, safe and private.

## Tech Highlights
- Pure frontend, no backend
- TOTP algorithm, Base32 encode/decode
- QR scan (jsQR), generate (kjua)
- Local storage, JSON import/export
- WebDAV standard protocol cloud sync
- Responsive UI for mobile & PC

## Deploy to GitHub Pages
1. Upload `index.html` to your repo's main branch.
2. Go to Settings → Pages, select main branch and root.
3. Wait a moment, then access via GitHub Pages link.

## Deploy to Cloudflare Pages
1. Sign up and log in to [Cloudflare](https://pages.cloudflare.com/).
2. Create a new Pages project, link your GitHub repo.
3. Leave Build command empty, set Output directory to `./` (root).
4. Deploy and get a globally accelerated link.

### Advantages of Cloudflare Pages
- Global CDN acceleration
- Always free for personal/small projects
- Auto-deploy on every GitHub push
- No server needed, pure static hosting
- Custom domain & HTTPS supported

---

> This project is a pure frontend single-file solution, ideal for personal or open-source use. Data is only stored locally or in your own cloud, ensuring privacy and security.

</details> 