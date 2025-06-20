# TOTP Token Manager

> ⚠️ **Maintenance Status**: This project is no longer maintained and is shared as open source code only. Please resolve any issues yourself or fork and modify as needed.
> 
> English | [中文](./README.md)

A powerful, secure, and reliable frontend-only TOTP (Time-based One-Time Password) token manager. No backend service required, all data is securely stored in your browser locally or in your GitHub Gist. Single file design, ready to use out of the box.

## ✨ Core Features

### 🔐 TOTP Token Management
- **Dynamic Code Generation**: Real-time generation of 6-digit TOTP verification codes with 30-second auto-refresh
- **Countdown Display**: Intuitive progress bars and countdown timers, showing remaining seconds on PC and circular progress on mobile
- **One-Click Copy**: Click on dynamic codes to copy to clipboard, with copy notifications on mobile
- **Token Management**: Add, edit, delete tokens with customizable user information

### 📱 Multi-Platform Optimization
- **Responsive Design**: Perfectly adapted for desktop and mobile devices
- **Mobile Gestures**: 
  - Long press cards to enter multi-select mode
  - Swipe left to delete, swipe right to edit
  - Touch-friendly operation interface
- **Dark Mode**: Automatically follows system theme switching
- **Batch Operations**: Support multi-select deletion and batch export

### 🔍 Smart Import System
- **Camera Scanning**: Real-time QR code scanning to add tokens
- **Image Recognition**: Support QR code images in PNG, JPG, JPEG, BMP, GIF, WebP formats
- **Multi-Format File Import**:
  - **JSON Files**: Standard TOTP token array format
  - **CSV Files**: User info, secret format
  - **TXT Files**: Support otpauth://URI batch import
  - **Encrypted Files**: Support password-protected encrypted backup files
- **Drag & Drop Upload**: Support file drag and drop to specified areas for batch import
- **Duplicate Detection**: Automatically detect and skip existing tokens

### 💾 Data Backup & Sync
- **Local Export**:
  - Plain text JSON format
  - Custom password encrypted format
  - Individual token QR code export
- **GitHub Gist Cloud Backup**:
  - Support both plain text and encrypted backup methods
  - Automatically create/update Gist files
  - One-click restore functionality
  - Use GitHub PAT for authentication

### 🛡️ Security Features
- **Local Storage**: All data stored in browser LocalStorage
- **AES Encryption**: Use CryptoJS for data encryption
- **Serverless**: Completely offline operation, no data upload
- **Password Protection**: Support custom password encryption for backup files

## 🚀 Quick Start

### Method 1: Direct Use
1. Download the `index.html` file
2. Open with modern browsers (Chrome, Firefox, Safari, Edge)
3. Start adding and managing your TOTP tokens

### Method 2: Web Deployment
Support deployment to any static website service:
- **GitHub Pages**: Upload to repository and enable Pages
- **Cloudflare Pages**: Global CDN acceleration
- **Vercel/Netlify**: Modern deployment platforms
- **Self-hosted Server**: Any web server supporting static files

## 📋 Usage Guide

### Adding Tokens
1. Click the "+" button or use scanning function
2. Enter user information (such as email, account, etc.)
3. Enter Base32 format secret key
4. Click add to complete

### Batch Import
1. Click "Batch Scan Import" button
2. Select files or drag to specified area
3. Support multiple formats: QR code images, JSON, CSV, TXT
4. System automatically recognizes and imports valid tokens

### Cloud Backup Setup
1. Get GitHub Personal Access Token (requires gist permission)
2. Configure PAT in "Gist Cloud Backup"
3. Choose encrypted backup or plain text backup
4. One-click backup/restore data

### Mobile Operations
- **Long press card**: Enter multi-select mode
- **Swipe left**: Quick delete
- **Swipe right**: Quick edit
- **Click dynamic code**: Copy to clipboard

## 🛠️ Technical Architecture

- **Frontend Framework**: Vue.js 3 (Composition API)
- **UI Components**: Bootstrap 5 + Bootstrap Icons
- **Encryption Algorithm**: CryptoJS (AES-256)
- **QR Code Processing**: jsQR (parsing) + kjua (generation)
- **TOTP Algorithm**: Native JavaScript implementation
- **Storage**: LocalStorage + GitHub Gist API

## 🔒 Security Notes

### Data Security
- All token data stored only in local browser
- Support AES encryption to protect sensitive data
- No data tracking or upload functionality

### Password Security
- **Important**: Please remember your encryption backup password
- Lost passwords cannot recover encrypted data
- Recommend using strong passwords and keeping them safe

### GitHub PAT Security
- PAT stored only in browser locally
- Recommend setting shorter validity periods
- Only requires gist permission, minimizing permission scope

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## 🤝 Contributing

> ⚠️ **Note**: This project is no longer maintained and is shared as open source code only. If you need new features or bug fixes, we recommend forking this project and modifying it yourself.

## 📄 License

[MIT License](./LICENSE)

---

**Note**: This is a frontend-only application where all functionality runs in the browser. Please ensure you use it in a secure environment and properly safeguard your encryption passwords and GitHub PAT. 
