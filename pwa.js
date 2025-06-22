// PWA 注册和管理脚本
class PWAManager {
  constructor() {
    this.swRegistration = null;
    this.isOnline = navigator.onLine;
    this.init();
  }

  async init() {
    try {
      // 检查是否在支持的环境中（HTTPS 或 localhost）
      const isSecureContext = window.location.protocol === 'https:' || 
                             window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1';
      
      // 检查manifest是否可用（在本地文件环境中直接跳过）
      const manifestAvailable = !window.isLocalFile && document.querySelector('link[rel="manifest"]') && 
                               !document.querySelector('link[rel="manifest"]').hasAttribute('data-error');
      
      // 检查浏览器是否支持Service Worker
      if ('serviceWorker' in navigator && isSecureContext && !window.isLocalFile) {
        await this.registerServiceWorker();
        this.setupEventListeners();
        this.checkForUpdates();
      } else if (window.isLocalFile) {
        // 在本地文件环境中，仍然设置基本的事件监听器
        this.setupBasicEventListeners();
      } else {
        this.setupBasicEventListeners();
      }

      // 检查是否支持PWA安装
      if ('BeforeInstallPromptEvent' in window && manifestAvailable && !window.isLocalFile) {
        this.setupInstallPrompt();
      }
    } catch (error) {
      console.error('PWA初始化失败:', error);
    }
  }

  async registerServiceWorker() {
    try {
      this.swRegistration = await navigator.serviceWorker.register('sw.js', {
        scope: './'
      });

      // 监听Service Worker更新
      this.swRegistration.addEventListener('updatefound', () => {
        const newWorker = this.swRegistration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.showUpdateNotification();
          }
        });
      });

      // 监听Service Worker控制权变化
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.showToast('应用已更新到最新版本', 'success');
      });

      // 检查Service Worker是否已经激活
      if (this.swRegistration.active) {
        this.setupCacheCleanup();
      } else {
        // 等待Service Worker激活
        this.swRegistration.addEventListener('activate', () => {
          this.setupCacheCleanup();
        });
      }

    } catch (error) {
      console.error('Service Worker 注册失败:', error);
    }
  }

  setupEventListeners() {
    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showToast('网络连接已恢复', 'success');
      // 只有在有Service Worker的情况下才执行同步
      if (this.swRegistration) {
        this.syncData();
      }
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showToast('网络连接已断开，应用仍可离线使用', 'warning');
    });

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline && this.swRegistration) {
        this.checkForUpdates();
      }
    });

    // 监听Service Worker控制权变化，确保在激活后再设置缓存清理
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      this.showToast('应用已更新到最新版本', 'success');
      // 在控制权转移后设置缓存清理
      this.setupCacheCleanup();
    });

    // 如果Service Worker已经激活，立即设置缓存清理
    if (this.swRegistration && this.swRegistration.active) {
      this.setupCacheCleanup();
    }
  }

  // 基本事件监听器，用于本地文件环境
  setupBasicEventListeners() {
    // 监听网络状态变化（基本功能）
    window.addEventListener('online', () => {
      this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  setupCacheCleanup() {
    // 检查是否需要清理缓存
    const lastCleanup = localStorage.getItem('pwa_last_cache_cleanup');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24小时

    if (!lastCleanup || (now - parseInt(lastCleanup)) >= oneDay) {
      this.cleanupCache();
      localStorage.setItem('pwa_last_cache_cleanup', now.toString());
    }
  }

  async cleanupCache() {
    if (this.swRegistration && 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        // 确保Service Worker已经激活
        if (this.swRegistration.active) {
          await this.swRegistration.sync.register('cache-cleanup');
        }
      } catch (error) {
        console.error('缓存清理任务注册失败:', error);
      }
    }
  }

  setupInstallPrompt() {
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // 显示安装提示
      this.showInstallPrompt();
    });

    // 监听应用安装完成
    window.addEventListener('appinstalled', () => {
      this.showToast('应用已成功安装到桌面', 'success');
      deferredPrompt = null;
    });
  }

  showInstallPrompt() {
    const installButton = document.createElement('button');
    installButton.className = 'btn btn-primary position-fixed';
    installButton.style.cssText = 'bottom: 20px; right: 20px; z-index: 9999; border-radius: 50px; padding: 12px 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    installButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download me-2" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg>安装应用';
    
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
      installButton.remove();
    });

    document.body.appendChild(installButton);

    // 5秒后自动隐藏
    setTimeout(() => {
      if (installButton.parentNode) {
        installButton.remove();
      }
    }, 5000);
  }

  showUpdateNotification() {
    const updateButton = document.createElement('button');
    updateButton.className = 'btn btn-warning position-fixed';
    updateButton.style.cssText = 'bottom: 20px; right: 20px; z-index: 9999; border-radius: 50px; padding: 12px 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    updateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise me-2" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/></svg>更新应用';
    
    updateButton.addEventListener('click', () => {
      this.updateApp();
      updateButton.remove();
    });

    document.body.appendChild(updateButton);

    // 10秒后自动隐藏
    setTimeout(() => {
      if (updateButton.parentNode) {
        updateButton.remove();
      }
    }, 10000);
  }

  async updateApp() {
    if (this.swRegistration && this.swRegistration.waiting) {
      // 发送消息给等待中的Service Worker
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  async checkForUpdates() {
    if (this.swRegistration) {
      try {
        await this.swRegistration.update();
      } catch (error) {
        console.error('检查更新失败:', error);
      }
    }
  }

  async syncData() {
    if (this.swRegistration && 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        await this.swRegistration.sync.register('background-sync');
      } catch (error) {
        console.error('后台同步注册失败:', error);
      }
    }
  }

  showToast(message, type = 'info') {
    if (window.showToast) {
      window.showToast(message, type);
    }
  }

  // 获取PWA状态信息
  getPWAStatus() {
    return {
      isInstalled: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone,
      isOnline: this.isOnline,
      hasServiceWorker: !!this.swRegistration,
      isUpdateAvailable: !!(this.swRegistration && this.swRegistration.waiting)
    };
  }

  // 请求通知权限
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission;
    }
    return 'denied';
  }

  // 发送本地通知
  sendNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: 'icons/icon.svg',
        badge: 'icons/icon.svg',
        ...options
      });

      notification.addEventListener('click', () => {
        window.focus();
        notification.close();
      });

      return notification;
    }
  }
}

// 全局PWA管理器实例
window.pwaManager = new PWAManager();

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PWAManager;
} 