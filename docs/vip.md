---
title: 会员开通中心
hide:
  - navigation
  - toc
---

<div id="kzyc-vip-mount">
  <div style="text-align: center; padding: 50px 0; opacity: 0.6;">⏳ 正在加载会员专区...</div>
</div>

<style>
/* 核心自适应加宽与居中：杜绝文字拥挤折行 */
.md-content__inner {
  max-width: 1200px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
.kzyc-nowrap {
  white-space: nowrap !important;
}

.kzyc-vip-container {
  width: 100%;
  max-width: 1200px;
  margin: 10px auto 40px auto;
  box-sizing: border-box;
}
.kzyc-vip-header {
  text-align: center;
  margin-bottom: 28px;
}
.kzyc-vip-title {
  font-size: 2.1rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
}
.kzyc-vip-subtitle {
  font-size: 0.94rem;
  opacity: 0.75;
  margin: 0;
  white-space: nowrap;
}

/* 权益对比三大卡片：居中大标题与整洁排版 */
.kzyc-privilege-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}
.kzyc-privilege-card {
  background: var(--md-default-bg-color, #ffffff);
  border: 1px solid rgba(127, 127, 127, 0.2);
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}
.kzyc-privilege-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
.kzyc-privilege-card.vip {
  border-color: rgba(37, 99, 235, 0.45);
}
.kzyc-privilege-card.svip {
  border-color: rgba(192, 38, 211, 0.45);
  background: linear-gradient(180deg, rgba(217, 70, 239, 0.04) 0%, transparent 100%);
}

.kzyc-priv-badge {
  display: inline-block;
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 9999px;
  margin-bottom: 10px;
  white-space: nowrap;
}
.kzyc-priv-badge.user { background: rgba(127,127,127,0.12); color: inherit; }
.kzyc-priv-badge.vip { background: rgba(37,99,235,0.12); color: #2563eb; }
.kzyc-priv-badge.svip { background: rgba(192,38,211,0.12); color: #c026d3; }

/* 居中大标题 */
.kzyc-priv-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 16px;
  text-align: center;
  white-space: nowrap;
}

.kzyc-priv-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.86rem;
  line-height: 2.2;
  opacity: 0.85;
  text-align: left;
  display: inline-block;
}
.kzyc-priv-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

/* 购买选购主卡片 */
.kzyc-vip-card {
  background: var(--md-default-bg-color, #ffffff);
  border: 1px solid rgba(127, 127, 127, 0.2);
  border-radius: 16px;
  padding: 26px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}
.kzyc-role-switcher {
  display: flex;
  gap: 12px;
  background: rgba(127, 127, 127, 0.08);
  padding: 5px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.kzyc-role-tab {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 0.96rem;
  font-weight: 700;
  color: inherit;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0.65;
  white-space: nowrap;
}
.kzyc-role-tab.active {
  opacity: 1;
  background: var(--md-default-bg-color, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.kzyc-role-tab.vip.active { color: #2563eb !important; }
.kzyc-role-tab.svip.active { color: #c026d3 !important; }

/* 时长套餐卡片网格 */
.kzyc-duration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}
.kzyc-duration-item {
  border: 1.5px solid rgba(127, 127, 127, 0.22);
  border-radius: 12px;
  padding: 18px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: transparent;
  box-sizing: border-box;
  white-space: nowrap;
}
.kzyc-duration-item:hover {
  border-color: #2563eb;
  transform: translateY(-2px);
}
.kzyc-duration-item.active {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.06);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
}
.kzyc-duration-tag {
  position: absolute;
  top: -8px;
  right: -6px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  padding: 1px 6px;
  border-radius: 9999px;
  background: #ea580c;
  white-space: nowrap;
}
.kzyc-duration-tag.best {
  background: linear-gradient(135deg, #c026d3, #7c3aed);
}
.kzyc-duration-name {
  font-size: 0.88rem;
  font-weight: 700;
  margin-bottom: 6px;
  white-space: nowrap;
}
.kzyc-duration-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2563eb;
  white-space: nowrap;
}
.kzyc-duration-price small {
  font-size: 0.85rem;
  font-weight: 600;
  margin-right: 2px;
}
.kzyc-duration-tip {
  font-size: 0.72rem;
  opacity: 0.65;
  margin-top: 4px;
  white-space: nowrap;
}

/* 支付方式 */
.kzyc-paytype-wrap {
  margin-bottom: 24px;
}
.kzyc-paytype-title {
  font-size: 0.84rem;
  font-weight: 700;
  margin-bottom: 10px;
  white-space: nowrap;
}
.kzyc-paytype-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.kzyc-paytype-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  border: 1.5px solid rgba(127, 127, 127, 0.25);
  background: transparent;
  cursor: pointer;
  font-size: 0.88rem;
  font-weight: 600;
  color: inherit;
  transition: all 0.2s;
  white-space: nowrap;
}
.kzyc-paytype-btn.active {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
}
.kzyc-paytype-btn.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* 结算状态操作栏 */
.kzyc-checkout-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(127, 127, 127, 0.15);
  padding-top: 20px;
  flex-wrap: wrap;
  gap: 14px;
}
.kzyc-checkout-user {
  font-size: 0.85rem;
  line-height: 1.6;
}
.kzyc-checkout-btn {
  padding: 11px 34px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  white-space: nowrap;
}
.kzyc-checkout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
}

/* 底部单行平滑滚动赞助条 (Marquee) */
.kzyc-sponsors-marquee-container {
  width: 100%;
  overflow: hidden;
  background: rgba(37, 99, 235, 0.04);
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: 12px;
  padding: 10px 0;
  margin-top: 28px;
  white-space: nowrap;
  position: relative;
  box-sizing: border-box;
}
.kzyc-sponsors-track {
  display: inline-flex;
  gap: 40px;
  animation: kzyc-marquee-scroll 35s linear infinite;
  white-space: nowrap;
}
.kzyc-sponsors-marquee-container:hover .kzyc-sponsors-track {
  animation-play-state: paused;
}
.kzyc-sponsor-item {
  font-size: 0.82rem;
  color: inherit;
  opacity: 0.85;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
@keyframes kzyc-marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* 支付扫码弹窗 */
.kzyc-pay-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999999;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.kzyc-pay-modal {
  background: var(--md-default-bg-color, #ffffff);
  border-radius: 16px;
  padding: 26px;
  max-width: 390px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.25);
  position: relative;
  box-sizing: border-box;
}
.kzyc-pay-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.5;
}
.kzyc-pay-modal-close:hover { opacity: 1; }

/* 二维码外层容器（含相对定位居中 Logo） */
.kzyc-qrcode-wrapper {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 14px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.kzyc-qrcode-img {
  width: 250px;
  height: 250px;
  border-radius: 12px;
  display: block;
  border: 1px solid rgba(127, 127, 127, 0.2);
  padding: 8px;
  background: #fff;
  box-sizing: border-box;
}
.kzyc-alipay-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  background: #ffffff;
  border: 2.5px solid #ffffff;
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  pointer-events: none;
}

/* 电脑端直接打开支付宝付款便捷按钮 */
.kzyc-pc-pay-btn {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: #f0f7ff;
  border: 1px solid #adc6ff;
  color: #1677ff !important;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.92rem;
  margin-top: 12px;
  box-sizing: border-box;
  white-space: nowrap;
  transition: all 0.2s;
}
.kzyc-pc-pay-btn:hover {
  background: #1677ff;
  color: #ffffff !important;
}

.kzyc-mobile-pay-btn {
  display: none;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: #1677ff;
  color: #fff !important;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.92rem;
  margin-top: 10px;
  box-sizing: border-box;
  white-space: nowrap;
}
@media (max-width: 600px) {
  .kzyc-mobile-pay-btn { display: block !important; }
}
</style>

<script>
(function() {
  const API_BASE = "https://auth.kzyc.de5.net";
  const TOKEN_KEY = "kzyc_token";

  let currentUser = null;
  let selectedRole = "vip";
  let selectedDuration = "1y";
  let checkTimer = null;
  let dynamicPricing = null;
  let sponsorsList = [];

  const DEFAULT_PRIVILEGES = {
    user: [
      "✅ 每天限下载 3 篇资源",
      "✅ 支持公开软件下载",
      "❌ 无权下载会员专享资源",
      "❌ 社区互动基础权益"
    ],
    vip: [
      "🚀 每天限下载 10 篇资源",
      "🔓 尊享全站【会员专享】资源",
      "🔑 畅享专属高速网盘与解压码",
      "💬 专属标准会员身份徽标"
    ],
    svip: [
      "⚡ 每天限下载 20 篇海量资源",
      "🌟 全站所有资源任意无限畅下",
      "👑 专属至尊超级会员高贵徽标",
      "🤝 优先资源更新与技术答疑"
    ]
  };
  let currentPrivileges = DEFAULT_PRIVILEGES;

  const DEFAULT_PRICING = {
    vip: {
      "1m": { amount: "1.90", name: "标准会员(1个月)" },
      "3m": { amount: "3.90", name: "标准会员(3个月)" },
      "6m": { amount: "6.90", name: "标准会员(6个月)" },
      "1y": { amount: "9.90", name: "标准会员(1年)" },
      "forever": { amount: "88.00", name: "标准会员(永久)" }
    },
    svip: {
      "1m": { amount: "5.90", name: "超级会员(1个月)" },
      "3m": { amount: "6.90", name: "超级会员(3个月)" },
      "6m": { amount: "9.90", name: "超级会员(6个月)" },
      "1y": { amount: "19.90", name: "超级会员(1年)" },
      "forever": { amount: "168.00", name: "超级会员(永久)" }
    }
  };

  const DURATION_LABELS = {
    "1m": { label: "1 个月", tip: "轻度体验" },
    "3m": { label: "3 个月", tip: "季度特惠" },
    "6m": { label: "6 个月", tip: "半年超值" },
    "1y": { label: "1 年 (推荐)", tip: "人气爆款", hot: true },
    "forever": { label: "永久会员", tip: "终身无忧", best: true }
  };

  async function loadVipConfig() {
    try {
      const res = await fetch(`${API_BASE}/api/vip/config`);
      const data = await res.json();
      if (data.success) {
        dynamicPricing = data.pricing || DEFAULT_PRICING;
        if (data.privileges) currentPrivileges = data.privileges;
        sponsorsList = data.sponsors || [];
      }
    } catch {
      dynamicPricing = DEFAULT_PRICING;
    }
    checkUser();
  }

  async function checkUser() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentUser = data.user;
        } else {
          currentUser = null;
        }
      } catch {
        currentUser = null;
      }
    } else {
      currentUser = null;
    }
    renderVIPPage();
  }

  function renderVIPPage() {
    const root = document.getElementById("kzyc-vip-mount");
    if (!root) return;

    const pricing = dynamicPricing || DEFAULT_PRICING;
    const curPricing = pricing[selectedRole] || DEFAULT_PRICING[selectedRole];
    const curSelected = curPricing[selectedDuration] || { amount: "9.90" };

    let userStatusHtml = "";
    if (currentUser) {
      const effRole = currentUser.effective_role || "user";
      let roleLabel = "普通用户";
      if (effRole === "admin") roleLabel = "👑 站长管理员";
      else if (effRole === "svip") roleLabel = "👑 超级会员";
      else if (effRole === "vip") roleLabel = "💎 标准会员";

      const expire = currentUser.vip_expire_at || "无";

      userStatusHtml = `
        <div class="kzyc-checkout-user">
          <div class="kzyc-nowrap">充值账号: <strong>${currentUser.username}</strong> (#${currentUser.id})</div>
          <div class="kzyc-nowrap" style="opacity: 0.7; font-size: 0.78rem;">当前身份: ${roleLabel} | 到期时间: ${expire.includes("2999") ? "永久有效" : expire}</div>
        </div>
        <button type="button" class="kzyc-checkout-btn" id="kzyc-do-pay-btn">立即支付 ¥${curSelected.amount} 元</button>
      `;
    } else {
      userStatusHtml = `
        <div class="kzyc-checkout-user" style="color: #ea580c;">
          ⚠️ 您当前尚未登录，登录后才可为指定账号充值开通会员！
        </div>
        <button type="button" class="kzyc-checkout-btn" style="background: #2563eb;" onclick="document.getElementById('kzyc-open-auth')?.click()">🔑 立即登录 / 注册</button>
      `;
    }

    const sponsorItemsHTML = sponsorsList.map(item => `<span class="kzyc-sponsor-item">${item}</span>`).join('');
    const fullMarqueeHTML = sponsorItemsHTML + sponsorItemsHTML;

    root.innerHTML = `
      <div class="kzyc-vip-container">
        <div class="kzyc-vip-header">
          <h1 class="kzyc-vip-title">👑 K资源仓 · 专属会员特权中心</h1>
          <p class="kzyc-vip-subtitle">开通尊贵会员特权，解锁全站所有资源高速下载与解压密码</p>
        </div>

        <!-- 权益对比三大卡片 (后台可自由编辑) -->
        <div class="kzyc-privilege-grid">
          <div class="kzyc-privilege-card user">
            <span class="kzyc-priv-badge user">普通用户</span>
            <div class="kzyc-priv-title">免费注册</div>
            <ul class="kzyc-priv-list">
              ${(currentPrivileges.user || DEFAULT_PRIVILEGES.user).map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>

          <div class="kzyc-privilege-card vip">
            <span class="kzyc-priv-badge vip">超值首选</span>
            <div class="kzyc-priv-title">💎 标准会员</div>
            <ul class="kzyc-priv-list">
              ${(currentPrivileges.vip || DEFAULT_PRIVILEGES.vip).map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>

          <div class="kzyc-privilege-card svip">
            <span class="kzyc-priv-badge svip">终极尊享</span>
            <div class="kzyc-priv-title">👑 超级会员</div>
            <ul class="kzyc-priv-list">
              ${(currentPrivileges.svip || DEFAULT_PRIVILEGES.svip).map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- 购买选购主卡片 -->
        <div class="kzyc-vip-card">
          <div class="kzyc-role-switcher">
            <button type="button" class="kzyc-role-tab vip ${selectedRole === 'vip' ? 'active' : ''}" data-role="vip">💎 标准会员</button>
            <button type="button" class="kzyc-role-tab svip ${selectedRole === 'svip' ? 'active' : ''}" data-role="svip">👑 超级会员</button>
          </div>

          <div class="kzyc-duration-grid">
            ${["1m", "3m", "6m", "1y", "forever"].map(key => {
              const item = curPricing[key] || { amount: "0.00" };
              const meta = DURATION_LABELS[key] || { label: key, tip: "" };
              const isAct = selectedDuration === key;
              return `
                <div class="kzyc-duration-item ${isAct ? 'active' : ''}" data-duration="${key}">
                  ${meta.hot ? '<span class="kzyc-duration-tag">推荐</span>' : ''}
                  ${meta.best ? '<span class="kzyc-duration-tag best">特惠</span>' : ''}
                  <div class="kzyc-duration-name">${meta.label}</div>
                  <div class="kzyc-duration-price"><small>¥</small>${item.amount}</div>
                  <div class="kzyc-duration-tip">${meta.tip}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="kzyc-paytype-wrap">
            <div class="kzyc-paytype-title">选择支付方式：</div>
            <div class="kzyc-paytype-group">
              <button type="button" class="kzyc-paytype-btn active" data-pay="alipay">
                <span style="font-size: 1.2rem;">🔵</span> 支付宝支付 (官方直连 · 实时到账)
              </button>
              <button type="button" class="kzyc-paytype-btn disabled" title="微信商户接口维护中，请优先使用支付宝">
                <span style="font-size: 1.2rem;">🟢</span> 微信支付 (即将开放)
              </button>
            </div>
          </div>

          <div class="kzyc-checkout-bar">
            ${userStatusHtml}
          </div>
        </div>

        <!-- 底部单行平滑滚动赞助展示条 -->
        <div class="kzyc-sponsors-marquee-container">
          <div class="kzyc-sponsors-track">
            ${fullMarqueeHTML}
          </div>
        </div>
      </div>

      <!-- 支付扫码弹窗 -->
      <div id="kzyc-pay-modal" class="kzyc-pay-modal-backdrop">
        <div class="kzyc-pay-modal">
          <button type="button" class="kzyc-pay-modal-close" id="kzyc-close-pay-modal">✕</button>
          <div style="font-size: 1.15rem; font-weight: 800; margin-bottom: 4px;">支付宝安全扫码支付</div>
          <div id="kzyc-pay-subject" style="font-size: 0.85rem; opacity: 0.75;">--</div>
          <div id="kzyc-pay-amount" style="font-size: 1.8rem; font-weight: 800; color: #2563eb; margin: 8px 0;">¥ 0.00</div>

          <!-- 高清大尺寸二维码容器 + 支付宝居中 Logo -->
          <div class="kzyc-qrcode-wrapper">
            <img id="kzyc-pay-qrcode" class="kzyc-qrcode-img" src="" alt="支付宝二维码" />
            <img class="kzyc-alipay-logo" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="Alipay" />
          </div>

          <div style="font-size: 0.82rem; opacity: 0.75;" id="kzyc-pay-status-tip">⏳ 请使用手机支付宝“扫一扫”完成支付</div>

          <!-- 电脑端直接打开付款页面便捷通道 -->
          <a href="#" id="kzyc-pc-jump" target="_blank" class="kzyc-pc-pay-btn">💻 电脑网页直接打开支付宝付款 ›</a>

          <!-- 移动端一键唤起 App -->
          <a href="#" id="kzyc-mobile-jump" target="_blank" class="kzyc-mobile-pay-btn">🚀 手机端打开支付宝付款</a>
        </div>
      </div>
    `;

    document.querySelectorAll(".kzyc-role-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        selectedRole = tab.getAttribute("data-role");
        renderVIPPage();
      });
    });

    document.querySelectorAll(".kzyc-duration-item").forEach(item => {
      item.addEventListener("click", () => {
        selectedDuration = item.getAttribute("data-duration");
        renderVIPPage();
      });
    });

    document.getElementById("kzyc-do-pay-btn")?.addEventListener("click", startPayment);

    document.getElementById("kzyc-close-pay-modal")?.addEventListener("click", () => {
      const modal = document.getElementById("kzyc-pay-modal");
      if (modal) modal.style.display = "none";
      if (checkTimer) clearInterval(checkTimer);
    });
  }

  async function startPayment() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      alert("请先登录账号！");
      return;
    }

    const payBtn = document.getElementById("kzyc-do-pay-btn");
    payBtn.disabled = true;
    payBtn.textContent = "正在生成专属订单...";

    try {
      const res = await fetch(`${API_BASE}/api/pay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          role: selectedRole,
          duration: selectedDuration,
          pay_type: "alipay"
        })
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.error || "创建订单失败");
        payBtn.disabled = false;
        payBtn.textContent = "重新尝试";
        return;
      }

      const modal = document.getElementById("kzyc-pay-modal");
      modal.style.display = "flex";

      document.getElementById("kzyc-pay-subject").textContent = data.subject;
      document.getElementById("kzyc-pay-amount").textContent = `¥ ${data.amount}`;
      document.getElementById("kzyc-pay-status-tip").textContent = "⏳ 等待扫码付款中，请在 15 分钟内完成...";

      const payTarget = data.pay_url || data.qr_code;

      // 生成高清大尺寸二维码（300x300，ecc=H 最高容错率，确保中心带 Logo 仍秒识别）
      const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=H&margin=4&data=${encodeURIComponent(payTarget)}`;
      document.getElementById("kzyc-pay-qrcode").src = qrImgUrl;

      // 电脑端快捷付款跳转
      const pcBtn = document.getElementById("kzyc-pc-jump");
      if (pcBtn) pcBtn.href = payTarget;

      // 移动端快捷跳转
      const mobileBtn = document.getElementById("kzyc-mobile-jump");
      if (mobileBtn) mobileBtn.href = data.mobile_url || payTarget;

      const orderId = data.order_id;
      if (checkTimer) clearInterval(checkTimer);

      checkTimer = setInterval(async () => {
        try {
          const cRes = await fetch(`${API_BASE}/api/pay/check-order?order_id=${encodeURIComponent(orderId)}`);
          const cData = await cRes.json();
          if (cData.success && cData.status === "paid") {
            clearInterval(checkTimer);
            document.getElementById("kzyc-pay-status-tip").innerHTML = "<strong style='color:#16a34a;'>🎉 恭喜！支付成功，会员已生效！</strong>";
            setTimeout(() => {
              alert("🎉 恭喜您，会员权限已成功开通并生效！");
              location.reload();
            }, 1000);
          }
        } catch {}
      }, 1500);

    } catch (err) {
      alert("发起支付异常: " + err.message);
    } finally {
      const p = (dynamicPricing || DEFAULT_PRICING)[selectedRole][selectedDuration];
      payBtn.disabled = false;
      payBtn.textContent = `立即支付 ¥${p.amount} 元`;
    }
  }

  loadVipConfig();

  if (typeof document$ !== "undefined") {
    document$.subscribe(loadVipConfig);
  }
})();
</script>