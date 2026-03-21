// 共用工具函數庫

// 本地儲存工具
const Storage = {
    // 儲存遊戲分數
    saveScore(gameName, difficulty, score) {
        const key = `${gameName}_${difficulty}_highscore`;
        localStorage.setItem(key, score);
        return true;
    },
    
    // 讀取遊戲分數
    getScore(gameName, difficulty) {
        const key = `${gameName}_${difficulty}_highscore`;
        return parseInt(localStorage.getItem(key)) || 0;
    },
    
    // 儲存遊戲設定
    saveSetting(gameName, settingName, value) {
        const key = `${gameName}_setting_${settingName}`;
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    },
    
    // 讀取遊戲設定
    getSetting(gameName, settingName, defaultValue = null) {
        const key = `${gameName}_setting_${settingName}`;
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    },
    
    // 清除遊戲資料
    clearGameData(gameName) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(gameName)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        return keysToRemove.length;
    }
};

// 遊戲工具
const GameUtils = {
    // 產生隨機整數 (包含 min 和 max)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // 產生隨機顏色
    randomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    
    // 格式化分數 (添加千位分隔符)
    formatScore(score) {
        return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // 計算遊戲時間
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // 深拷貝物件
    deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // 防抖函數
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 節流函數
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 音效工具
const AudioManager = {
    sounds: {},
    
    // 載入音效
    loadSound(name, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(url);
            audio.addEventListener('canplaythrough', () => {
                this.sounds[name] = audio;
                resolve(audio);
            });
            audio.addEventListener('error', reject);
            audio.load();
        });
    },
    
    // 播放音效
    playSound(name, volume = 1.0) {
        if (this.sounds[name]) {
            const sound = this.sounds[name].cloneNode();
            sound.volume = volume;
            sound.play().catch(e => console.warn('音效播放失敗:', e));
            return sound;
        }
        return null;
    },
    
    // 停止所有音效
    stopAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
};

// 動畫工具
const Animation = {
    // 淡入效果
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    },
    
    // 淡出效果
    fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(element.style.opacity) || 1;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.max(initialOpacity - (progress / duration), 0);
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.style.opacity = initialOpacity;
            }
        };
        requestAnimationFrame(animate);
    },
    
    // 滑入效果
    slideIn(element, duration = 300) {
        element.style.transform = 'translateY(-20px)';
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            element.style.opacity = percentage;
            element.style.transform = `translateY(${-20 + (20 * percentage)}px)`;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
};

// 可訪問性工具
const Accessibility = {
    // 為元素添加 ARIA 標籤
    setAriaLabel(element, label) {
        element.setAttribute('aria-label', label);
        return element;
    },
    
    // 為按鈕添加角色
    setButtonRole(element) {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        return element;
    },
    
    // 添加鍵盤事件支援
    addKeyboardSupport(element, callback) {
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                callback();
            }
        });
        return element;
    },
    
    // 焦點管理
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', (event) => {
                if (event.key === 'Tab') {
                    if (event.shiftKey) {
                        if (document.activeElement === firstElement) {
                            event.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            event.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        }
    }
};

// 匯出所有工具
window.GameTools = {
    Storage,
    GameUtils,
    AudioManager,
    Animation,
    Accessibility
};

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('遊戲工具庫已載入');
});