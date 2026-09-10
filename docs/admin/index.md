---
title: 站长管理后台
hide:
  - toc
  - navigation
---

<div id="kzyc-admin-mount">
  <div style="padding: 40px 0; text-align: center; opacity: 0.6;" id="kzyc-admin-loading-tip">
    ⏳ 正在验证站长身份，请稍候...
  </div>
</div>

<style>
/* 核心居中与自适应加宽：让管理后台水平居中，消除偏左现象 */
.md-content__inner {
  max-width: 1200px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
.kzyc-adm-card {
  background: var(--md-default-bg-color, #ffffff);
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 14px;
  padding: 22px;
  margin: 10px auto 30px auto !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
}
.kzyc-adm-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(127, 127, 127, 0.15);
  padding-bottom: 14px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}
.kzyc-adm-nav {
  display: flex;
  gap: 8px;
  border-bottom: 2px solid rgba(127, 127, 127, 0.12);
  padding-bottom: 8px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.kzyc-adm-tab {
  padding: 7px 14px;
  font-size: 0.86rem;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: inherit;
  opacity: 0.65;
  cursor: pointer;
  transition: all 0.2s;
}
.kzyc-adm-tab:hover { opacity: 1; background: rgba(37, 99, 235, 0.08); }
.kzyc-adm-tab.active { opacity: 1; background: #2563eb; color: #ffffff !important; }

.kzyc-adm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}
.kzyc-adm-stat {
  background: rgba(127, 127, 127, 0.04);
  border: 1px solid rgba(127, 127, 127, 0.15);
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}
.kzyc-adm-stat-num { font-size: 1.7rem; font-weight: 800; color: #2563eb; margin: 4px 0; }
.kzyc-adm-stat-num.warn { color: #ea580c; }
.kzyc-adm-stat-num.success { color: #16a34a; }
.kzyc-adm-stat-label { font-size: 0.8rem; opacity: 0.7; }

/* 财务收入专属卡片网格 */
.kzyc-rev-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}
.kzyc-rev-card {
  border-radius: 12px;
  padding: 16px 18px;
  box-sizing: border-box;
  text-align: left;
}
.kzyc-rev-card.today { background: #eff6ff; border: 1px solid #bfdbfe; }
.kzyc-rev-card.month { background: #f0fdf4; border: 1px solid #bbf7d0; }
.kzyc-rev-card.year { background: #faf5ff; border: 1px solid #e9d5ff; }
.kzyc-rev-card.total { background: #fff7ed; border: 1px solid #fed7aa; }
.kzyc-rev-title { font-size: 0.82rem; font-weight: 700; }
.kzyc-rev-card.today .kzyc-rev-title { color: #1e40af; }
.kzyc-rev-card.month .kzyc-rev-title { color: #166534; }
.kzyc-rev-card.year .kzyc-rev-title { color: #6b21a8; }
.kzyc-rev-card.total .kzyc-rev-title { color: #9a3412; }
.kzyc-rev-num { font-size: 1.7rem; font-weight: 800; margin: 6px 0 2px 0; }
.kzyc-rev-card.today .kzyc-rev-num { color: #1d4ed8; }
.kzyc-rev-card.month .kzyc-rev-num { color: #15803d; }
.kzyc-rev-card.year .kzyc-rev-num { color: #7e22ce; }
.kzyc-rev-card.total .kzyc-rev-num { color: #c2410c; }
.kzyc-rev-sub { font-size: 0.74rem; opacity: 0.75; }

/* 表格自适应扩展与字体微调 */
.kzyc-adm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  margin-top: 10px;
}
.kzyc-adm-table th, .kzyc-adm-table td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(127, 127, 127, 0.12);
  text-align: left;
  vertical-align: middle;
}
.kzyc-adm-table th { background: rgba(127, 127, 127, 0.06); font-weight: 700; font-size: 0.78rem; }

/* 关键防折行类 */
.kzyc-nowrap {
  white-space: nowrap !important;
}

.kzyc-cell-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 380px;
}

.kzyc-adm-btn {
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.kzyc-adm-btn.primary { background: #2563eb; color: #fff !important; }
.kzyc-adm-btn.success { background: #16a34a; color: #fff !important; }
.kzyc-adm-btn.danger { background: #dc2626; color: #fff !important; }
.kzyc-adm-btn.warn { background: #ea580c; color: #fff !important; }

.kzyc-adm-form-card {
  background: rgba(127, 127, 127, 0.04);
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
.kzyc-adm-input {
  width: 100%;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: var(--md-default-bg-color, #fff);
  color: inherit;
  box-sizing: border-box;
  font-size: 0.84rem;
  margin-top: 4px;
}
.kzyc-search-input {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: var(--md-default-bg-color, #fff);
  color: inherit;
  font-size: 0.82rem;
  width: 220px;
}

.kzyc-pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 16px;
  flex-wrap: wrap;
  font-size: 0.8rem;
}
.kzyc-page-btn {
  padding: 4px 9px;
  border-radius: 6px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 0.76rem;
  transition: all 0.15s;
}
.kzyc-page-btn:hover:not(.disabled):not(.active) {
  background: rgba(37, 99, 235, 0.08);
  border-color: #2563eb;
}
.kzyc-page-btn.active {
  background: #2563eb;
  color: #fff !important;
  border-color: #2563eb;
}
.kzyc-page-btn.disabled { opacity: 0.35; cursor: not-allowed; }
.kzyc-page-ellipsis { padding: 0 4px; opacity: 0.5; }
.kzyc-page-jump { display: inline-flex; align-items: center; gap: 4px; margin-left: 8px; }
.kzyc-page-input {
  width: 44px;
  padding: 3px 5px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid rgba(127, 127, 127, 0.25);
  background: transparent;
  color: inherit;
  font-size: 0.78rem;
}

.kzyc-banner-card {
  border: 1px solid rgba(127, 127, 127, 0.18);
  border-radius: 10px;
  padding: 14px;
  background: rgba(127, 127, 127, 0.03);
  margin-bottom: 14px;
}
.kzyc-banner-preview {
  max-width: 100%;
  max-height: 130px;
  border-radius: 8px;
  object-fit: cover;
  margin-top: 8px;
  border: 1px solid rgba(127, 127, 127, 0.2);
  display: block;
}
</style>

<script>
(function() {
  window.addEventListener("error", function(e) {
    console.error("[kzyc-admin-error]", e);
    const tip = document.getElementById("kzyc-admin-loading-tip");
    if (tip) {
      tip.innerHTML = "<div style='color:#ef4444; font-weight:bold;'>⚠️ 脚本执行异常: " + (e.message || "未知错误") + "</div><div style='font-size:0.75rem; opacity:0.7; margin-top:4px;'>请按 F12 打开控制台查看错误详情或按 Ctrl+F5 刷新</div>";
    }
  });

  const API_BASE = "https://auth.kzyc.de5.net";
  const TOKEN_KEY = "kzyc_token";
  let adminStats = null;
  let activeTab = "overview";

  let allResources = [];
  let filteredResources = [];
  let resCurrentPage = 1;
  const RES_PAGE_SIZE = 10;

  let allUsers = [];
  let filteredUsers = [];
  let userCurrentPage = 1;
  const USER_PAGE_SIZE = 10;
  let allDeletedAccounts = [];

  // VIP 账单管理分页与状态
  let allOrders = [];
  let ordersCurrentPage = 1;
  let ordersTotal = 0;
  let ordersTotalPages = 1;
  let ordersSearchKeyword = "";
  let ordersStatusFilter = "";
  let ordersRevenueStats = null;
  const ORDERS_PAGE_SIZE = 10;

  let allComments = [];
  let filteredComments = [];
  let commCurrentPage = 1;
  const COMM_PAGE_SIZE = 10;
  let commFilterStatus = "all";

  let allWords = [];
  let filteredWords = [];
  let wordCurrentPage = 1;
  const WORD_PAGE_SIZE = 50;

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updatePendingBadge(count) {
    const num = Math.max(0, parseInt(count, 10) || 0);
    if (adminStats) {
      adminStats.pending_comments = num;
    }
    const badge = document.getElementById("kzyc-pending-badge");
    if (badge) {
      badge.textContent = num;
      badge.style.display = num > 0 ? "inline-block" : "none";
    }
    const overviewStat = document.getElementById("kzyc-stat-pending-num");
    if (overviewStat) {
      overviewStat.textContent = num;
      if (num > 0) overviewStat.classList.add("warn");
      else overviewStat.classList.remove("warn");
    }
  }

  async function refreshAdminStats() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.stats) {
        adminStats = data.stats;
        updatePendingBadge(adminStats.pending_comments);
      }
    } catch {}
  }

  function renderPaginationHTML(currentPage, totalItems, pageSize, funcName) {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    if (totalPages <= 1) return "";

    let html = `<div class="kzyc-pagination-wrap">`;
    if (currentPage > 1) {
      html += `<button class="kzyc-page-btn" onclick="${funcName}(1)">首页</button>`;
      html += `<button class="kzyc-page-btn" onclick="${funcName}(${currentPage - 1})">上一页</button>`;
    } else {
      html += `<button class="kzyc-page-btn disabled">首页</button>`;
      html += `<button class="kzyc-page-btn disabled">上一页</button>`;
    }

    const delta = 2;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    html += `<button class="kzyc-page-btn ${currentPage === 1 ? 'active' : ''}" onclick="${funcName}(1)">1</button>`;
    if (range.length > 0 && range[0] > 2) html += `<span class="kzyc-page-ellipsis">...</span>`;
    for (let i of range) {
      html += `<button class="kzyc-page-btn ${currentPage === i ? 'active' : ''}" onclick="${funcName}(${i})">${i}</button>`;
    }
    if (range.length > 0 && range[range.length - 1] < totalPages - 1) html += `<span class="kzyc-page-ellipsis">...</span>`;
    if (totalPages > 1) {
      html += `<button class="kzyc-page-btn ${currentPage === totalPages ? 'active' : ''}" onclick="${funcName}(${totalPages})">${totalPages}</button>`;
    }

    if (currentPage < totalPages) {
      html += `<button class="kzyc-page-btn" onclick="${funcName}(${currentPage + 1})">下一页</button>`;
      html += `<button class="kzyc-page-btn" onclick="${funcName}(${totalPages})">末页</button>`;
    } else {
      html += `<button class="kzyc-page-btn disabled">下一页</button>`;
      html += `<button class="kzyc-page-btn disabled">末页</button>`;
    }

    html += `
      <span class="kzyc-page-jump">
        到第 <input type="number" class="kzyc-page-input" id="${funcName}-jump-val" min="1" max="${totalPages}" value="${currentPage}" onkeydown="if(event.key==='Enter') ${funcName}(parseInt(this.value, 10))" /> 页
        <button class="kzyc-page-btn" onclick="${funcName}(parseInt(document.getElementById('${funcName}-jump-val').value, 10))">跳转</button>
      </span>
    `;
    html += `</div>`;
    return html;
  }

  async function checkAdminAuth() {
    const root = document.getElementById("kzyc-admin-mount");
    if (!root) return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      renderNoPermission(root, "您当前未登录，无法访问站长管理后台。请先登录管理员账号！", false);
      return;
    }

    root.innerHTML = `
      <div style="padding: 50px 0; text-align: center;" id="kzyc-admin-loading-tip">
        <div style="font-size: 2.2rem; margin-bottom: 12px;">⏳</div>
        <div style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px;">正在连接云端校验站长权限...</div>
        <div style="font-size: 0.78rem; opacity: 0.6;">跨国网络建立握手中，请稍候片刻</div>
      </div>
    `;

    try {
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 25000) : null;

      const res = await fetch(`${API_BASE}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller ? controller.signal : undefined
      });
      if (timeoutId) clearTimeout(timeoutId);

      const data = await res.json();
      if (data.success) {
        adminStats = data.stats || {};
        renderAdminDashboard(root, data.admin || { username: "站长" });
      } else {
        renderNoPermission(root, data.error || "当前登录账号非管理员，拒绝访问！", true);
      }
    } catch (err) {
      console.error("[kzyc-admin] 验证请求异常:", err);
      const isTimeout = err.name === "AbortError";
      const errMsg = isTimeout
        ? "连接超时：云端网络延迟较高，未能及时收到响应。请点击下方重试！"
        : ("通信异常：" + (err.message || "无法连接到认证服务器"));
      renderNoPermission(root, errMsg, true);
    }
  }

  function renderNoPermission(root, text, canRetry) {
    root.innerHTML = `
      <div class="kzyc-adm-card" style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">🔒</div>
        <h3 style="margin: 0 0 10px;">站长专属管理后台</h3>
        <p style="opacity: 0.75; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.5;">${escapeHTML(text)}</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          ${canRetry ? `<button type="button" class="kzyc-adm-btn primary" style="padding: 10px 24px; font-size: 0.9rem;" id="kzyc-admin-retry-btn">🔄 重新尝试连接</button>` : ''}
          <button type="button" class="kzyc-adm-btn ${canRetry ? 'warn' : 'primary'}" style="padding: 10px 24px; font-size: 0.9rem;" id="kzyc-admin-login-btn">🔑 登录 / 切换管理员账号</button>
        </div>
      </div>
    `;

    document.getElementById("kzyc-admin-retry-btn")?.addEventListener("click", () => {
      checkAdminAuth();
    });

    document.getElementById("kzyc-admin-login-btn")?.addEventListener("click", () => {
      const backdrop = document.getElementById("kzyc-auth-modal");
      if (backdrop) {
        backdrop.classList.add("active");
        const authView = document.getElementById("kzyc-auth-view");
        const profView = document.getElementById("kzyc-profile-view");
        const forgView = document.getElementById("kzyc-forgot-view");
        if (authView) authView.style.display = "block";
        if (profView) profView.style.display = "none";
        if (forgView) forgView.style.display = "none";

        const msgEl = document.getElementById("kzyc-auth-msg");
        if (msgEl) {
          msgEl.className = "kzyc-msg error";
          msgEl.textContent = "请登录具有【站长/管理员】权限的账号！";
        }

        function ensureTurnstile() {
          if (!document.getElementById("cf-turnstile-script")) {
            const s = document.createElement("script");
            s.id = "cf-turnstile-script";
            s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            s.async = true;
            s.defer = true;
            (document.head || document.documentElement).appendChild(s);
          }
          if (typeof turnstile !== "undefined") {
            const loginEl = document.getElementById("kzyc-login-turnstile");
            if (loginEl && !loginEl.hasChildNodes()) {
              turnstile.render(loginEl, { sitekey: "0x4AAAAAAElpbO-4m9lnVEmf", theme: "auto" });
            }
          } else {
            setTimeout(ensureTurnstile, 200);
          }
        }
        ensureTurnstile();
      } else {
        document.getElementById("kzyc-open-auth")?.click();
      }
    });
  }

  function renderAdminDashboard(root, admin) {
    const pendingNum = (adminStats && adminStats.pending_comments) || 0;
    root.innerHTML = `
      <div class="kzyc-adm-card">
        <div class="kzyc-adm-topbar">
          <div style="font-size: 1.25rem; font-weight: 800;">👑 K资源仓 · 站长管理后台</div>
          <div style="font-size: 0.86rem; opacity: 0.85;">
            当前站长：<strong>${escapeHTML(admin.username || "管理员")}</strong>
            <span style="opacity: 0.5; margin: 0 6px;">·</span>
            <a href="javascript:void(0)" id="kzyc-adm-logout" style="color: #ef4444;">退出管理</a>
          </div>
        </div>

        <div class="kzyc-adm-nav">
          <button class="kzyc-adm-tab active" data-tab="overview">📊 数据概览</button>
          <button class="kzyc-adm-tab" data-tab="orders">💳 VIP 账单与收入</button>
          <button class="kzyc-adm-tab" data-tab="resources">📦 资源管理</button>
          <button class="kzyc-adm-tab" data-tab="banners">🖼️ 首页轮播图</button>
          <button class="kzyc-adm-tab" data-tab="comments">💬 评论审核 <span id="kzyc-pending-badge" style="background: #ea580c; color: #fff; padding: 1px 6px; border-radius: 10px; font-size: 0.7rem; display: ${pendingNum > 0 ? 'inline-block' : 'none'};">${pendingNum}</span></button>
          <button class="kzyc-adm-tab" data-tab="users">👥 用户与会员</button>
          <button class="kzyc-adm-tab" data-tab="vip-config">💎 会员套餐配置</button>
          <button class="kzyc-adm-tab" data-tab="words">🧹 敏感词库</button>
        </div>

        <div id="kzyc-adm-panel"></div>
      </div>
    `;

    document.getElementById("kzyc-adm-logout").addEventListener("click", () => {
      localStorage.removeItem(TOKEN_KEY);
      location.reload();
    });

    document.querySelectorAll(".kzyc-adm-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".kzyc-adm-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeTab = tab.getAttribute("data-tab");
        switchTab(activeTab);
      });
    });

    switchTab("overview");
  }

  function switchTab(tab) {
    const panel = document.getElementById("kzyc-adm-panel");
    if (!panel) return;

    if (tab === "overview") renderOverviewTab(panel);
    if (tab === "orders") renderOrdersTab(panel);
    if (tab === "resources") renderResourcesTab(panel);
    if (tab === "banners") renderBannersTab(panel);
    if (tab === "comments") renderCommentsTab(panel);
    if (tab === "users") renderUsersTab(panel);
    if (tab === "vip-config") renderVipConfigTab(panel);
    if (tab === "words") renderWordsTab(panel);
  }

  // 1. 数据看板 (集成全站运营指标 + VIP 收入四维统计)
  function renderOverviewTab(panel) {
    const stats = adminStats || {};
    panel.innerHTML = `
      <div style="font-weight: 800; font-size: 0.98rem; margin-bottom: 12px; color: #1e40af;">💰 VIP 财务收入四维看板</div>
      <div class="kzyc-rev-grid">
        <div class="kzyc-rev-card today">
          <div class="kzyc-rev-title">📅 今日收入</div>
          <div class="kzyc-rev-num">¥ ${stats.today_revenue || "0.00"}</div>
          <div class="kzyc-rev-sub">今日付款：${stats.today_paid_orders || 0} 笔</div>
        </div>
        <div class="kzyc-rev-card month">
          <div class="kzyc-rev-title">🗓️ 本月收入</div>
          <div class="kzyc-rev-num">¥ ${stats.month_revenue || "0.00"}</div>
          <div class="kzyc-rev-sub">本月累计到账</div>
        </div>
        <div class="kzyc-rev-card year">
          <div class="kzyc-rev-title">📆 本年收入</div>
          <div class="kzyc-rev-num">¥ ${stats.year_revenue || "0.00"}</div>
          <div class="kzyc-rev-sub">年度总业绩</div>
        </div>
        <div class="kzyc-rev-card total">
          <div class="kzyc-rev-title">💎 历史累计总收入</div>
          <div class="kzyc-rev-num">¥ ${stats.total_revenue || "0.00"}</div>
          <div class="kzyc-rev-sub">总成交：${stats.total_paid_orders || 0} 笔</div>
        </div>
      </div>

      <div style="font-weight: 800; font-size: 0.98rem; margin: 20px 0 12px 0;">📊 全站基础运营指标</div>
      <div class="kzyc-adm-grid">
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">👥 注册总用户</div><div class="kzyc-adm-stat-num">${stats.total_users || 0}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">📈 今日新增注册</div><div class="kzyc-adm-stat-num">${stats.today_reg || 0}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">💬 全站评论总数</div><div class="kzyc-adm-stat-num">${stats.total_comments || 0}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">⏳ 待审核评论</div><div class="kzyc-adm-stat-num ${(stats.pending_comments || 0) > 0 ? 'warn' : ''}" id="kzyc-stat-pending-num">${stats.pending_comments || 0}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">📥 今日下载次数</div><div class="kzyc-adm-stat-num">${stats.today_downloads || 0}</div></div>
        <div class="kzyc-adm-stat"><div class="kzyc-adm-stat-label">📦 全站总资源数</div><div class="kzyc-adm-stat-num">${stats.total_resources || 0}</div></div>
      </div>
      <div style="font-size: 0.82rem; opacity: 0.6; text-align: center;">⚡ Cloudflare D1 边缘数据库实时驱动</div>
    `;
  }

  // 1.5 VIP 账单管理与财务收入统计 (新增模块)
  async function renderOrdersTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载 VIP 账单记录与财务统计...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const url = `${API_BASE}/api/admin/orders?page=${ordersCurrentPage}&page_size=${ORDERS_PAGE_SIZE}&search=${encodeURIComponent(ordersSearchKeyword)}&status=${encodeURIComponent(ordersStatusFilter)}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        allOrders = data.orders || [];
        ordersTotal = data.total || 0;
        ordersTotalPages = data.total_pages || 1;
        ordersRevenueStats = data.revenue_stats || {};
        drawOrdersTable(panel);
      } else {
        panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">加载账单失败：${data.error || "无权限"}</div>`;
      }
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取账单异常：${err.message}</div>`;
    }
  }

  function drawOrdersTable(panel) {
    const rev = ordersRevenueStats || {};

    panel.innerHTML = `
      <!-- 顶部财务四维数据看板 -->
      <div class="kzyc-rev-grid">
        <div class="kzyc-rev-card today">
          <div class="kzyc-rev-title">📅 今日收入</div>
          <div class="kzyc-rev-num">¥ ${rev.today_revenue || "0.00"}</div>
          <div class="kzyc-rev-sub">今日成交: ${rev.today_paid_orders || 0} 笔</div>
        </div>
        <div class="kzyc-rev-card month">
          <div class="kzyc-rev-title">🗓️ 本月收入</div>
          <div class="kzyc-rev-num">¥ ${rev.month_revenue || "0.00"}</div>
          <div class="kzyc-rev-sub">当月会员充值汇总</div>
        </div>
        <div class="kzyc-rev-card year">
          <div class="kzyc-rev-title">📆 本年收入</div>
          <div class="kzyc-rev-num">¥ ${rev.year_revenue || "0.00"}</div>
          <div class="kzyc-rev-sub">年度总入账</div>
        </div>
        <div class="kzyc-rev-card total">
          <div class="kzyc-rev-title">💰 累计总收入</div>
          <div class="kzyc-rev-num">¥ ${rev.total_revenue || "0.00"}</div>
          <div class="kzyc-rev-sub">历史总成交: ${rev.total_paid_orders || 0} 笔</div>
        </div>
      </div>

      <!-- 搜索栏与状态筛选 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <input class="kzyc-search-input" id="kzyc-order-search-input" value="${escapeHTML(ordersSearchKeyword)}" placeholder="🔍 搜用户名 / 邮箱 / 订单号 / 流水号" style="width: 260px;" />
          <select class="kzyc-adm-input" id="kzyc-order-status-select" style="width: 120px; margin-top: 0; padding: 6px 10px;">
            <option value="" ${ordersStatusFilter === '' ? 'selected' : ''}>全部状态</option>
            <option value="paid" ${ordersStatusFilter === 'paid' ? 'selected' : ''}>已支付 (paid)</option>
            <option value="pending" ${ordersStatusFilter === 'pending' ? 'selected' : ''}>待付款 (pending)</option>
          </select>
          <button class="kzyc-adm-btn primary" id="kzyc-order-search-btn">查询</button>
          ${(ordersSearchKeyword || ordersStatusFilter) ? `<button class="kzyc-adm-btn" id="kzyc-order-reset-btn">重置筛选</button>` : ''}
        </div>
        <div style="font-size: 0.8rem; opacity: 0.65;">共检索到 ${ordersTotal} 笔订单</div>
      </div>

      <!-- 订单表格 -->
      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th class="kzyc-nowrap" style="width: 150px;">系统订单号</th>
              <th class="kzyc-nowrap" style="width: 160px;">充值用户</th>
              <th class="kzyc-nowrap" style="width: 130px;">开通套餐</th>
              <th class="kzyc-nowrap" style="width: 90px;">实付金额</th>
              <th class="kzyc-nowrap" style="width: 85px;">支付状态</th>
              <th class="kzyc-nowrap" style="width: 140px;">时间记录</th>
              <th>支付宝交易流水号</th>
              <th class="kzyc-nowrap" style="width: 120px;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${allOrders.length === 0 ? '<tr><td colspan="8" style="text-align: center; opacity: 0.5; padding: 24px;">暂无匹配的账单数据</td></tr>' : allOrders.map(o => {
              const isPaid = o.status === "paid";
              const statusBadge = isPaid
                ? '<span style="color: #16a34a; font-weight: 700; background: rgba(22,163,74,0.1); padding: 2px 8px; border-radius: 4px; white-space: nowrap;">已支付</span>'
                : '<span style="color: #64748b; background: rgba(127,127,127,0.12); padding: 2px 8px; border-radius: 4px; white-space: nowrap;">待付款</span>';

              const durMap = { "1m": "1个月", "3m": "3个月", "6m": "6个月", "1y": "1年", "forever": "永久" };
              const roleText = o.role === "svip" ? "👑 超级会员" : "💎 标准会员";
              const durText = durMap[o.duration] || o.duration;

              return `
                <tr>
                  <td class="kzyc-nowrap"><code style="font-size: 0.76rem;">${escapeHTML(o.order_id)}</code></td>
                  <td>
                    <strong class="kzyc-cell-truncate" style="max-width: 150px;" title="${escapeHTML(o.username)}">${escapeHTML(o.username)}</strong>
                    <div style="font-size: 0.72rem; opacity: 0.6;" class="kzyc-cell-truncate" title="${escapeHTML(o.email)}">${escapeHTML(o.email)}</div>
                  </td>
                  <td class="kzyc-nowrap">${roleText} (${durText})</td>
                  <td class="kzyc-nowrap"><strong style="color: #2563eb; font-size: 0.95rem;">¥ ${o.amount}</strong></td>
                  <td class="kzyc-nowrap">${statusBadge}</td>
                  <td class="kzyc-nowrap" style="font-size: 0.72rem; line-height: 1.4; opacity: 0.75;">
                    下单: ${o.created_at || '-'}<br>
                    支付: ${o.paid_at ? `<span style="color: #16a34a;">${o.paid_at}</span>` : '-'}
                  </td>
                  <td><span class="kzyc-cell-truncate" style="font-family: monospace; font-size: 0.74rem; opacity: 0.8;" title="${escapeHTML(o.trade_no || '无')}">${escapeHTML(o.trade_no || '-')}</span></td>
                  <td class="kzyc-nowrap" style="display: flex; gap: 4px; align-items: center;">
                    ${!isPaid ? `<button class="kzyc-adm-btn success" onclick="handleCompleteOrder('${escapeHTML(o.order_id)}')">手动补单</button>` : ''}
                    <button class="kzyc-adm-btn danger" onclick="handleDeleteOrder('${escapeHTML(o.order_id)}')">删除</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- 分页组件 -->
      <div id="kzyc-orders-pagination-container">
        ${renderPaginationHTML(ordersCurrentPage, ordersTotal, ORDERS_PAGE_SIZE, "gotoOrdersPage")}
      </div>
    `;

    document.getElementById("kzyc-order-search-btn")?.addEventListener("click", () => {
      ordersSearchKeyword = document.getElementById("kzyc-order-search-input").value.trim();
      ordersStatusFilter = document.getElementById("kzyc-order-status-select").value;
      ordersCurrentPage = 1;
      renderOrdersTab(panel);
    });

    document.getElementById("kzyc-order-search-input")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        ordersSearchKeyword = e.target.value.trim();
        ordersStatusFilter = document.getElementById("kzyc-order-status-select").value;
        ordersCurrentPage = 1;
        renderOrdersTab(panel);
      }
    });

    document.getElementById("kzyc-order-status-select")?.addEventListener("change", (e) => {
      ordersStatusFilter = e.target.value;
      ordersCurrentPage = 1;
      renderOrdersTab(panel);
    });

    document.getElementById("kzyc-order-reset-btn")?.addEventListener("click", () => {
      ordersSearchKeyword = "";
      ordersStatusFilter = "";
      ordersCurrentPage = 1;
      renderOrdersTab(panel);
    });
  }

  window.gotoOrdersPage = function(p) {
    if (isNaN(p) || p < 1) p = 1;
    if (p > ordersTotalPages) p = ordersTotalPages;
    ordersCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) renderOrdersTab(panel);
  };

  window.handleCompleteOrder = async function(orderId) {
    if (!confirm(`确认要将订单 [${orderId}] 手动标记为已支付并激活该用户的 VIP 会员权限吗？`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/orders/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ order_id: orderId })
    });
    const d = await res.json();
    alert(d.message || d.error);
    if (d.success) {
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderOrdersTab(panel);
      refreshAdminStats();
    }
  };

  window.handleDeleteOrder = async function(orderId) {
    if (!confirm(`确定要彻底删除该订单记录 [${orderId}] 吗？`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/orders/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ order_id: orderId })
    });
    const d = await res.json();
    alert(d.message || d.error);
    if (d.success) {
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderOrdersTab(panel);
      refreshAdminStats();
    }
  };

  // 2. 资源管理
  async function renderResourcesTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取资源列表...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/resources`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      allResources = data.resources || [];
      filteredResources = allResources;
      resCurrentPage = 1;
      drawResourcesTable(panel);
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取资源失败：${err.message}</div>`;
    }
  }

  function drawResourcesTable(panel) {
    const token = localStorage.getItem(TOKEN_KEY);
    const startIdx = (resCurrentPage - 1) * RES_PAGE_SIZE;
    const pageItems = filteredResources.slice(startIdx, startIdx + RES_PAGE_SIZE);

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <input class="kzyc-search-input" id="kzyc-res-search-input" placeholder="🔍 搜索软件标题或 Key..." />
          <span style="font-size: 0.8rem; opacity: 0.6;">共 ${filteredResources.length} 项</span>
        </div>
        <button class="kzyc-adm-btn primary" id="kzyc-add-res-btn">➕ 新增软件资源</button>
      </div>

      <div id="kzyc-res-form-wrap" style="display: none;" class="kzyc-adm-form-card">
        <h4 style="margin-top: 0; font-size: 0.92rem;" id="kzyc-res-form-title">新增软件资源</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">资源标识 (Key，与文章 data-key 一致)</label>
            <input class="kzyc-adm-input" id="kzyc-inp-key" placeholder="如: illustrator-2026" />
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">软件标题名称</label>
            <input class="kzyc-adm-input" id="kzyc-inp-title" placeholder="如: Adobe Illustrator 2026 中文直装版" />
          </div>
        </div>
        <div style="margin-bottom: 8px;">
          <label style="font-size: 0.78rem; font-weight: 600;">多网盘链接与提取码（网盘名 | 链接 | 提取码，分号 ; 隔开）</label>
          <textarea class="kzyc-adm-input" id="kzyc-inp-url" style="min-height: 80px;" placeholder="百度网盘 | https://pan.baidu.com/... | 8888; 夸克网盘 | https://pan.quark.cn/... | 免密"></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">专属解压密码</label>
            <input class="kzyc-adm-input" id="kzyc-inp-pwd" placeholder="如: 爱果核" />
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">下载门槛权限</label>
            <select class="kzyc-adm-input" id="kzyc-inp-vip-only">
              <option value="0">🌐 普通公开资源 (所有登录用户可下载，受每日配额限制)</option>
              <option value="1">🔒 会员专享资源 (仅标准会员/超级会员/站长可下载)</option>
            </select>
          </div>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button class="kzyc-adm-btn" id="kzyc-cancel-res-btn">取消</button>
          <button class="kzyc-adm-btn primary" id="kzyc-save-res-btn">保存并生效</button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th class="kzyc-nowrap" style="width: 140px;">标识 Key</th>
              <th class="kzyc-nowrap" style="width: 220px;">软件标题</th>
              <th>网盘链接配置 (单行截断，编辑查看全部)</th>
              <th class="kzyc-nowrap" style="width: 90px;">解压密码</th>
              <th class="kzyc-nowrap" style="width: 105px;">下载权限</th>
              <th class="kzyc-nowrap" style="width: 110px;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? '<tr><td colspan="6" style="text-align: center; opacity: 0.5; padding: 20px;">暂无匹配资源</td></tr>' : pageItems.map(r => `
              <tr>
                <td class="kzyc-nowrap"><code class="kzyc-cell-truncate" style="max-width: 130px;" title="${escapeHTML(r.resource_key)}">${escapeHTML(r.resource_key)}</code></td>
                <td><strong class="kzyc-cell-truncate" style="max-width: 200px;" title="${escapeHTML(r.title)}">${escapeHTML(r.title)}</strong></td>
                <td><span class="kzyc-cell-truncate" style="opacity: 0.8;" title="${escapeHTML(r.download_url)}">${escapeHTML(r.download_url)}</span></td>
                <td class="kzyc-nowrap"><span style="background: rgba(234, 88, 12, 0.1); color: #ea580c; padding: 2px 6px; border-radius: 4px; font-size: 0.74rem; font-weight: 600; white-space: nowrap;">${escapeHTML(r.unzip_pwd || '无')}</span></td>
                <td class="kzyc-nowrap">${r.is_vip_only === 1 ? '<span style="color: #ea580c; font-weight: 700; background: rgba(234,88,12,0.1); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">🔒 会员专享</span>' : '<span style="opacity: 0.7; white-space: nowrap;">🌐 公开</span>'}</td>
                <td class="kzyc-nowrap">
                  <button class="kzyc-adm-btn primary" data-key="${escapeHTML(r.resource_key)}" data-title="${escapeHTML(r.title)}" data-url="${escapeHTML(r.download_url)}" data-pwd="${escapeHTML(r.unzip_pwd || '')}" data-vip="${r.is_vip_only || 0}" onclick="handleEditResource(this)">编辑</button>
                  <button class="kzyc-adm-btn danger" onclick="deleteResource('${escapeHTML(r.resource_key)}')">删除</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div id="kzyc-res-pagination-container">
        ${renderPaginationHTML(resCurrentPage, filteredResources.length, RES_PAGE_SIZE, "gotoResPage")}
      </div>
    `;

    const searchInput = document.getElementById("kzyc-res-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        filteredResources = allResources.filter(r =>
          (r.resource_key && r.resource_key.toLowerCase().includes(q)) ||
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.download_url && r.download_url.toLowerCase().includes(q))
        );
        resCurrentPage = 1;
        drawResourcesTable(panel);
        const newSearchInput = document.getElementById("kzyc-res-search-input");
        if (newSearchInput) {
          newSearchInput.value = e.target.value;
          newSearchInput.focus();
        }
      });
    }

    document.getElementById("kzyc-add-res-btn")?.addEventListener("click", () => {
      const wrap = document.getElementById("kzyc-res-form-wrap");
      wrap.style.display = "block";
      document.getElementById("kzyc-res-form-title").textContent = "➕ 新增软件资源";
      const kInput = document.getElementById("kzyc-inp-key");
      kInput.disabled = false;
      kInput.value = "";
      document.getElementById("kzyc-inp-title").value = "";
      document.getElementById("kzyc-inp-url").value = "";
      document.getElementById("kzyc-inp-pwd").value = "";
      document.getElementById("kzyc-inp-vip-only").value = "0";
      wrap.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById("kzyc-cancel-res-btn")?.addEventListener("click", () => {
      document.getElementById("kzyc-res-form-wrap").style.display = "none";
    });

    document.getElementById("kzyc-save-res-btn")?.addEventListener("click", async () => {
      const key = document.getElementById("kzyc-inp-key").value.trim();
      const title = document.getElementById("kzyc-inp-title").value.trim();
      const download_url = document.getElementById("kzyc-inp-url").value.trim();
      const unzip_pwd = document.getElementById("kzyc-inp-pwd").value.trim();
      const is_vip_only = document.getElementById("kzyc-inp-vip-only").value;

      if (!key || !title || !download_url) {
        alert("请完整填写标识Key、软件标题和网盘链接！");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/resources/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resource_key: key, title, download_url, unzip_pwd, is_vip_only })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "保存成功！");
        renderResourcesTab(panel);
      } else {
        alert(data.error || "保存失败");
      }
    });
  }

  window.gotoResPage = function(p) {
    const totalPages = Math.ceil(filteredResources.length / RES_PAGE_SIZE) || 1;
    if (isNaN(p) || p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    resCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawResourcesTable(panel);
  };

  // 3. 轮播图管理
  async function renderBannersTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取首页轮播图配置...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    const res = await fetch(`${API_BASE}/api/admin/banners`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    const banners = data.banners || [];
    const b1 = banners[0] || { title: "", image_url: "", link_url: "" };
    const b2 = banners || { title: "", image_url: "", link_url: "" };

    panel.innerHTML = `
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 14px;">🖼️ 首页两张轮播图动态换图与链接</div>

      <div class="kzyc-banner-card">
        <h4 style="margin: 0 0 10px; color: #2563eb;">📌 轮播图 1 配置</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">图片地址</label>
            <input class="kzyc-adm-input" id="b1-img" value="${escapeHTML(b1.image_url)}" placeholder="https://... 或 assets/images/..." oninput="updateBannerPreview(1)" />
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">点击跳转链接</label>
            <input class="kzyc-adm-input" id="b1-link" value="${escapeHTML(b1.link_url)}" placeholder="/blog/xxx/ 或 https://..." />
          </div>
        </div>
        <div>
          <label style="font-size: 0.8rem; font-weight: 600;">图片标题 (可选)</label>
          <input class="kzyc-adm-input" id="b1-title" value="${escapeHTML(b1.title)}" placeholder="如：Adobe 2026 全家桶正式发布" />
        </div>
        <div>
          <img id="b1-preview" class="kzyc-banner-preview" src="${b1.image_url}" style="${b1.image_url ? '' : 'display:none;'}" />
        </div>
      </div>

      <div class="kzyc-banner-card">
        <h4 style="margin: 0 0 10px; color: #2563eb;">📌 轮播图 2 配置</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">图片地址</label>
            <input class="kzyc-adm-input" id="b2-img" value="${escapeHTML(b2.image_url)}" placeholder="https://... 或 assets/images/..." oninput="updateBannerPreview(2)" />
          </div>
          <div>
            <label style="font-size: 0.8rem; font-weight: 600;">点击跳转链接</label>
            <input class="kzyc-adm-input" id="b2-link" value="${escapeHTML(b2.link_url)}" placeholder="/blog/xxx/ 或 https://..." />
          </div>
        </div>
        <div>
          <label style="font-size: 0.8rem; font-weight: 600;">图片标题 (可选)</label>
          <input class="kzyc-adm-input" id="b2-title" value="${escapeHTML(b2.title)}" placeholder="如：PS 批量图层导出脚本工具" />
        </div>
        <div>
          <img id="b2-preview" class="kzyc-banner-preview" src="${b2.image_url}" style="${b2.image_url ? '' : 'display:none;'}" />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 14px;">
        <button class="kzyc-adm-btn primary" id="kzyc-save-banners-btn" style="padding: 10px 24px; font-size: 0.9rem;">💾 保存轮播图配置</button>
      </div>
    `;

    document.getElementById("kzyc-save-banners-btn")?.addEventListener("click", async () => {
      const payload = [
        {
          image_url: document.getElementById("b1-img").value.trim(),
          link_url: document.getElementById("b1-link").value.trim(),
          title: document.getElementById("b1-title").value.trim(),
        },
        {
          image_url: document.getElementById("b2-img").value.trim(),
          link_url: document.getElementById("b2-link").value.trim(),
          title: document.getElementById("b2-title").value.trim(),
        }
      ];

      const r = await fetch(`${API_BASE}/api/admin/banners/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ banners: payload })
      });
      const d = await r.json();
      if (d.success) alert("首页轮播图配置已成功更新并实时生效！");
      else alert(d.error || "保存失败");
    });
  }

  window.updateBannerPreview = function(num) {
    const val = document.getElementById(`b${num}-img`).value.trim();
    const img = document.getElementById(`b${num}-preview`);
    if (val) {
      img.src = val;
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }
  };

  // 4. 用户与会员管理
  async function renderUsersTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载用户列表...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      allUsers = data.users || [];
      filteredUsers = allUsers;
      allDeletedAccounts = data.deleted_accounts || [];
      userCurrentPage = 1;
      drawUsersTable(panel);
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取用户失败：${err.message}</div>`;
    }
  }

  function drawUsersTable(panel) {
    const token = localStorage.getItem(TOKEN_KEY);
    const startIdx = (userCurrentPage - 1) * USER_PAGE_SIZE;
    const pageItems = filteredUsers.slice(startIdx, startIdx + USER_PAGE_SIZE);

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <input class="kzyc-search-input" id="kzyc-user-search-input" placeholder="🔍 搜索 UID、用户名或邮箱..." />
          <span style="font-size: 0.8rem; opacity: 0.6;">共 ${filteredUsers.length} 位用户</span>
        </div>
        <button class="kzyc-adm-btn primary" id="kzyc-add-user-btn">➕ 添加新用户</button>
      </div>

      <div id="kzyc-user-form-wrap" style="display: none;" class="kzyc-adm-form-card">
        <h4 style="margin-top: 0; font-size: 0.92rem;" id="kzyc-user-form-title">添加新用户</h4>
        <input type="hidden" id="kzyc-user-id-val" />
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">用户名 (3-30 字符)</label>
            <input class="kzyc-adm-input" id="kzyc-user-name-inp" placeholder="输入用户名" />
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">注册邮箱</label>
            <input class="kzyc-adm-input" id="kzyc-user-email-inp" placeholder="example@mail.com" />
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px;">
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;">会员身份角色</label>
            <select class="kzyc-adm-input" id="kzyc-user-role-inp">
              <option value="user">普通用户 (每日限 3 篇，仅公开资源)</option>
              <option value="vip">💎 标准会员 (每日限 10 篇，可下会员专享)</option>
              <option value="svip">👑 超级会员 (每日限 20 篇，全站畅下)</option>
              <option value="admin">👑 站长管理员 (无限量畅享)</option>
            </select>
          </div>
          <div>
            <label style="font-size: 0.78rem; font-weight: 600;" id="kzyc-user-pwd-label">登录初始密码 (至少8位)</label>
            <input class="kzyc-adm-input" type="password" id="kzyc-user-pwd-inp" placeholder="输入密码" />
          </div>
        </div>
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <label style="font-size: 0.78rem; font-weight: 600;">会员到期日期 (普通用户可留空)</label>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('1m')">+1 个月</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('3m')">+3 个月</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('6m')">+6 个月</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('year')">+1 年</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('forever')">永久 (2999年)</button>
              <button type="button" class="kzyc-adm-btn" onclick="setExpireHelper('clear')">清空</button>
            </div>
          </div>
          <input class="kzyc-adm-input" type="date" id="kzyc-user-expire-inp" />
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button class="kzyc-adm-btn" id="kzyc-cancel-user-btn">取消</button>
          <button class="kzyc-adm-btn primary" id="kzyc-save-user-btn">确认提交</button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th class="kzyc-nowrap" style="width: 60px;">UID</th>
              <th class="kzyc-nowrap" style="width: 150px;">用户名</th>
              <th>邮箱</th>
              <th class="kzyc-nowrap" style="width: 130px;">身份状态</th>
              <th class="kzyc-nowrap" style="width: 115px;">会员到期时间</th>
              <th class="kzyc-nowrap" style="width: 130px;">注册时间</th>
              <th class="kzyc-nowrap" style="width: 160px;">管理操作</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? '<tr><td colspan="7" style="text-align: center; opacity: 0.5; padding: 20px;">暂无匹配用户</td></tr>' : pageItems.map(u => {
              let roleBadge = '<span style="color: #2563eb; background: rgba(37,99,235,0.1); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">普通用户</span>';
              const rLower = String(u.role || "").toLowerCase();
              if (rLower.includes('admin') || rLower.includes('站长') || rLower.includes('管理')) {
                roleBadge = '<span style="color: #ea580c; font-weight: 700; background: rgba(234,88,12,0.1); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">👑 站长</span>';
              } else if (rLower.includes('svip') || rLower.includes('超级')) {
                roleBadge = '<span style="color: #c026d3; font-weight: 700; background: rgba(217,70,239,0.1); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">👑 超级会员</span>';
              } else if (rLower.includes('vip') || rLower.includes('标准')) {
                roleBadge = '<span style="color: #2563eb; font-weight: 700; background: rgba(37,99,235,0.15); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">💎 标准会员</span>';
              }

              const isBanned = (u.is_banned === 1 || u.is_banned === "1");
              const banBadge = isBanned ? '<span style="color: #ef4444; font-weight: 700; background: rgba(239,68,68,0.12); padding: 2px 6px; border-radius: 4px; white-space: nowrap; margin-left: 4px; font-size: 0.72rem;">🚫 已封禁</span>' : '';

              let expireText = '--';
              if (u.vip_expire_at) {
                if (u.vip_expire_at.includes('2999')) expireText = '<span style="color: #16a34a; font-weight: 700;">永久有效</span>';
                else expireText = u.vip_expire_at;
              }

              return `
                <tr style="${isBanned ? 'background: rgba(239, 68, 68, 0.03);' : ''}">
                  <td class="kzyc-nowrap">#${u.id}</td>
                  <td><strong class="kzyc-cell-truncate" style="max-width: 140px;" title="${escapeHTML(u.username)}">${escapeHTML(u.username)}</strong></td>
                  <td><span class="kzyc-cell-truncate" title="${escapeHTML(u.email)}">${escapeHTML(u.email)}</span></td>
                  <td class="kzyc-nowrap">${roleBadge}${banBadge}</td>
                  <td class="kzyc-nowrap" style="font-size: 0.76rem;">${expireText}</td>
                  <td class="kzyc-nowrap" style="font-size: 0.74rem; opacity: 0.6;">${u.created_at ? u.created_at.slice(0, 16) : '--'}</td>
                  <td class="kzyc-nowrap" style="display: flex; gap: 4px; align-items: center;">
                    <button class="kzyc-adm-btn primary" data-id="${u.id}" data-name="${escapeHTML(u.username)}" data-email="${escapeHTML(u.email)}" data-role="${u.role}" data-expire="${u.vip_expire_at || ''}" onclick="handleEditUser(this)">编辑</button>
                    ${isBanned 
                      ? `<button class="kzyc-adm-btn success" onclick="handleToggleBan(${u.id}, 0, '${escapeHTML(u.username)}')">解封</button>` 
                      : `<button class="kzyc-adm-btn warn" onclick="handleToggleBan(${u.id}, 1, '${escapeHTML(u.username)}')">封禁</button>`}
                    <button class="kzyc-adm-btn danger" onclick="handleDeleteUser(${u.id}, '${escapeHTML(u.username)}')">删除</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div id="kzyc-user-pagination-container">
        ${renderPaginationHTML(userCurrentPage, filteredUsers.length, USER_PAGE_SIZE, "gotoUserPage")}
      </div>

      <div style="margin-top: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-weight: 700; font-size: 0.88rem; color: #ef4444;">⚠️ 已注销账号列表与拦截管控 (${allDeletedAccounts.length})</span>
          <span style="font-size: 0.74rem; opacity: 0.6;">注销期内禁止注册，可通过下方按钮直接恢复或删除</span>
        </div>
        <div style="overflow-x: auto;">
          <table class="kzyc-adm-table">
            <thead>
              <tr>
                <th class="kzyc-nowrap" style="width: 140px;">原用户名</th>
                <th>原注册邮箱</th>
                <th class="kzyc-nowrap" style="width: 150px;">注销时间</th>
                <th class="kzyc-nowrap" style="width: 150px;">管理操作</th>
              </tr>
            </thead>
            <tbody>
              ${allDeletedAccounts.length === 0 ? '<tr><td colspan="4" style="opacity: 0.5; text-align: center; padding: 12px;">暂无注销记录</td></tr>' : allDeletedAccounts.map(d => `
                <tr>
                  <td class="kzyc-nowrap"><strong>${escapeHTML(d.username)}</strong></td>
                  <td><span class="kzyc-cell-truncate" title="${escapeHTML(d.email)}">${escapeHTML(d.email)}</span></td>
                  <td class="kzyc-nowrap" style="font-size: 0.76rem; color: #ef4444;">${d.deleted_at}</td>
                  <td class="kzyc-nowrap">
                    <button class="kzyc-adm-btn success" onclick="handleRestoreDeleted('${escapeHTML(d.email)}', '${escapeHTML(d.username)}')">恢复账号</button>
                    <button class="kzyc-adm-btn danger" onclick="handleDeleteDeleted('${escapeHTML(d.email)}', '${escapeHTML(d.username)}')">彻底删除</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const searchInput = document.getElementById("kzyc-user-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        filteredUsers = allUsers.filter(u =>
          String(u.id).includes(q) ||
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
        );
        userCurrentPage = 1;
        drawUsersTable(panel);
        const newInp = document.getElementById("kzyc-user-search-input");
        if (newInp) {
          newInp.value = e.target.value;
          newInp.focus();
        }
      });
    }

    document.getElementById("kzyc-add-user-btn")?.addEventListener("click", () => {
      const wrap = document.getElementById("kzyc-user-form-wrap");
      wrap.style.display = "block";
      document.getElementById("kzyc-user-form-title").textContent = "➕ 添加新用户";
      document.getElementById("kzyc-user-id-val").value = "";
      document.getElementById("kzyc-user-name-inp").value = "";
      document.getElementById("kzyc-user-email-inp").value = "";
      document.getElementById("kzyc-user-role-inp").value = "user";
      document.getElementById("kzyc-user-pwd-inp").value = "";
      document.getElementById("kzyc-user-pwd-label").textContent = "登录初始密码 (至少8位)";
      document.getElementById("kzyc-user-pwd-inp").required = true;
      document.getElementById("kzyc-user-expire-inp").value = "";
      wrap.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById("kzyc-cancel-user-btn")?.addEventListener("click", () => {
      document.getElementById("kzyc-user-form-wrap").style.display = "none";
    });

    document.getElementById("kzyc-save-user-btn")?.addEventListener("click", async () => {
      const uid = document.getElementById("kzyc-user-id-val").value.trim();
      const username = document.getElementById("kzyc-user-name-inp").value.trim();
      const email = document.getElementById("kzyc-user-email-inp").value.trim();
      const role = document.getElementById("kzyc-user-role-inp").value;
      const pwd = document.getElementById("kzyc-user-pwd-inp").value.trim();
      const vipExpireAt = document.getElementById("kzyc-user-expire-inp").value.trim();

      if (!username || !email) {
        alert("用户名和邮箱不能为空！");
        return;
      }

      if (!uid && (!pwd || pwd.length < 8)) {
        alert("新增用户必须设置至少 8 位的初始密码！");
        return;
      }

      const endpoint = uid ? `${API_BASE}/api/admin/users/update` : `${API_BASE}/api/admin/users/add`;
      const payload = uid
        ? { user_id: uid, username, email, role, vip_expire_at: vipExpireAt, new_password: pwd }
        : { username, email, password: pwd, role, vip_expire_at: vipExpireAt };

      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const d = await r.json();
      if (d.success) {
        alert(d.message || "操作成功！");
        renderUsersTab(panel);
      } else {
        alert(d.error || "操作失败");
      }
    });
  }

  // 智能会员时长辅助设置器
  window.setExpireHelper = function(type) {
    const inp = document.getElementById("kzyc-user-expire-inp");
    if (!inp) return;

    if (type === "forever") {
      inp.value = "2999-12-31";
      return;
    }
    if (type === "clear") {
      inp.value = "";
      return;
    }

    let d = new Date();
    if (inp.value && !inp.value.includes("2999")) {
      const existing = new Date(inp.value + "T00:00:00");
      if (!isNaN(existing.getTime()) && existing.getTime() > d.getTime()) {
        d = existing;
      }
    }

    if (type === "1m") {
      d.setMonth(d.getMonth() + 1);
    } else if (type === "3m") {
      d.setMonth(d.getMonth() + 3);
    } else if (type === "6m") {
      d.setMonth(d.getMonth() + 6);
    } else if (type === "year") {
      d.setFullYear(d.getFullYear() + 1);
    }

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    inp.value = `${y}-${m}-${day}`;
  };

  window.gotoUserPage = function(p) {
    const totalPages = Math.ceil(filteredUsers.length / USER_PAGE_SIZE) || 1;
    if (isNaN(p) || p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    userCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawUsersTable(panel);
  };

  window.handleToggleBan = async function(uid, isBanned, username) {
    const actionText = isBanned ? "封禁拉黑" : "解除封禁";
    const tip = isBanned 
      ? `确定要【封禁拉黑】用户 [${username}] (UID: #${uid}) 吗？\n\n封禁后该账号将立即无法登录网站、无法获取下载资源或发表评论！`
      : `确定要【解除封禁】用户 [${username}] (UID: #${uid}) 吗？\n\n解除后该用户将完全恢复正常的登录与全站功能使用权限。`;
    
    if (!confirm(tip)) return;

    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/users/ban`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ user_id: uid, is_banned: isBanned })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || "操作成功！");
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderUsersTab(panel);
    } else {
      alert(data.error || "操作失败");
    }
  };

  window.handleEditResource = function(btn) {
    const wrap = document.getElementById("kzyc-res-form-wrap");
    if (!wrap) return;
    wrap.style.display = "block";

    const key = btn.getAttribute("data-key");
    const title = btn.getAttribute("data-title");
    const url = btn.getAttribute("data-url");
    const pwd = btn.getAttribute("data-pwd");
    const vip = btn.getAttribute("data-vip");

    document.getElementById("kzyc-res-form-title").textContent = `✏️ 编辑软件资源：${key}`;
    const inpKey = document.getElementById("kzyc-inp-key");
    inpKey.value = key;
    inpKey.disabled = true;
    document.getElementById("kzyc-inp-title").value = title;
    document.getElementById("kzyc-inp-url").value = url;
    document.getElementById("kzyc-inp-pwd").value = pwd;
    document.getElementById("kzyc-inp-vip-only").value = vip || "0";
    wrap.scrollIntoView({ behavior: 'smooth' });
  };

  window.deleteResource = async function(key) {
    if (!confirm(`确定要彻底删除资源 [${key}] 吗？删除后前台将无法获取该下载链接！`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/resources/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ resource_key: key })
    });
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) renderResourcesTab(panel);
  };

  window.handleEditUser = function(btn) {
    const wrap = document.getElementById("kzyc-user-form-wrap");
    if (!wrap) return;
    wrap.style.display = "block";

    const uid = btn.getAttribute("data-id");
    const name = btn.getAttribute("data-name");
    const email = btn.getAttribute("data-email");
    const role = btn.getAttribute("data-role");
    const expire = btn.getAttribute("data-expire");

    document.getElementById("kzyc-user-form-title").textContent = `✏️ 编辑用户 UID: #${uid}`;
    document.getElementById("kzyc-user-id-val").value = uid;
    document.getElementById("kzyc-user-name-inp").value = name;
    document.getElementById("kzyc-user-email-inp").value = email;
    document.getElementById("kzyc-user-role-inp").value = role || "user";
    document.getElementById("kzyc-user-pwd-label").textContent = "重置登录密码 (留空则不修改)";
    document.getElementById("kzyc-user-pwd-inp").value = "";
    document.getElementById("kzyc-user-pwd-inp").required = false;
    document.getElementById("kzyc-user-expire-inp").value = expire || "";
    wrap.scrollIntoView({ behavior: 'smooth' });
  };

  window.handleDeleteUser = async function(uid, username) {
    if (!confirm(`⚠️ 最终确认：确定要彻底删除用户 [${username}] (UID: #${uid}) 吗？`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/users/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ user_id: uid })
    });
    const data = await res.json();
    if (data.success) {
      alert("用户已删除！");
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderUsersTab(panel);
    } else {
      alert(data.error || "删除失败");
    }
  };

  window.handleRestoreDeleted = async function(email, username) {
    if (!confirm(`确定要恢复已注销账号 [${username}] (${email}) 吗？\n\n恢复后该用户将重新加入用户列表，初始密码设为 12345678，并自动解除注销拦截限制！`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/deleted-accounts/restore`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || "账号已成功恢复！");
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderUsersTab(panel);
    } else {
      alert(data.error || "恢复失败");
    }
  };

  window.handleDeleteDeleted = async function(email, username) {
    if (!confirm(`确定要彻底删除 [${username}] (${email}) 的注销记录吗？\n\n删除后该用户名和邮箱将立即解除1年冷却期锁定，允许重新注册！`)) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(`${API_BASE}/api/admin/deleted-accounts/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || "注销记录已彻底清除！");
      const panel = document.getElementById("kzyc-adm-panel");
      if (panel) renderUsersTab(panel);
    } else {
      alert(data.error || "删除失败");
    }
  };

  // 5. 评论审核（带状态筛选与分页系统）
  async function renderCommentsTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在加载评论列表...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/comments`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      allComments = data.comments || [];
      const pendingCount = allComments.filter(c => c.status === "pending").length;
      updatePendingBadge(pendingCount);
      commCurrentPage = 1;
      applyCommentFilter();
      drawCommentsTable(panel);
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取评论失败：${err.message}</div>`;
    }
  }

  function applyCommentFilter() {
    if (commFilterStatus === "pending") {
      filteredComments = allComments.filter(c => c.status === "pending");
    } else if (commFilterStatus === "approved") {
      filteredComments = allComments.filter(c => c.status === "approved");
    } else {
      filteredComments = allComments;
    }
  }

  function drawCommentsTable(panel) {
    const startIdx = (commCurrentPage - 1) * COMM_PAGE_SIZE;
    const pageItems = filteredComments.slice(startIdx, startIdx + COMM_PAGE_SIZE);
    const pendingCount = allComments.filter(c => c.status === "pending").length;
    const approvedCount = allComments.filter(c => c.status === "approved").length;

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="font-weight: 700; font-size: 0.95rem;">全站评论审核 (${allComments.length})</span>
          <div style="display: inline-flex; gap: 4px; background: rgba(127,127,127,0.08); padding: 3px; border-radius: 8px;">
            <button class="kzyc-adm-tab ${commFilterStatus === 'all' ? 'active' : ''}" style="padding: 3px 10px; font-size: 0.74rem;" onclick="filterCommentsStatus('all')">全部 (${allComments.length})</button>
            <button class="kzyc-adm-tab ${commFilterStatus === 'pending' ? 'active' : ''}" style="padding: 3px 10px; font-size: 0.74rem; ${pendingCount > 0 ? 'color: #ea580c; font-weight: 700;' : ''}" onclick="filterCommentsStatus('pending')">待审核 (${pendingCount})</button>
            <button class="kzyc-adm-tab ${commFilterStatus === 'approved' ? 'active' : ''}" style="padding: 3px 10px; font-size: 0.74rem;" onclick="filterCommentsStatus('approved')">已通过 (${approvedCount})</button>
          </div>
        </div>
        <div style="font-size: 0.8rem; opacity: 0.6;">当前筛选共 ${filteredComments.length} 条</div>
      </div>

      <div style="overflow-x: auto;">
        <table class="kzyc-adm-table">
          <thead>
            <tr>
              <th class="kzyc-nowrap" style="width: 50px;">ID</th>
              <th style="width: 150px;">文章路径</th>
              <th class="kzyc-nowrap" style="width: 100px;">发布用户</th>
              <th>评论内容</th>
              <th class="kzyc-nowrap" style="width: 80px;">状态</th>
              <th class="kzyc-nowrap" style="width: 120px;">发布时间</th>
              <th class="kzyc-nowrap" style="width: 110px;">操作</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.length === 0 ? '<tr><td colspan="7" style="text-align: center; opacity: 0.5; padding: 20px;">暂无匹配评论</td></tr>' : pageItems.map(c => `
              <tr id="kzyc-admin-comment-${c.id}">
                <td class="kzyc-nowrap">#${c.id}</td>
                <td><span class="kzyc-cell-truncate" style="max-width: 140px;" title="${escapeHTML(c.post_path)}">${escapeHTML(c.post_path)}</span></td>
                <td class="kzyc-nowrap"><strong class="kzyc-cell-truncate" style="max-width: 90px;" title="${escapeHTML(c.username)}">${escapeHTML(c.username)}</strong></td>
                <td><span class="kzyc-cell-truncate" title="${escapeHTML(c.content)}">${escapeHTML(c.content)}</span></td>
                <td class="kzyc-nowrap">${c.status === 'pending' ? '<span style="color: #ea580c; font-weight: 700; white-space: nowrap;">待审核</span>' : '<span style="color: #16a34a; white-space: nowrap;">已通过</span>'}</td>
                <td class="kzyc-nowrap" style="font-size: 0.74rem; opacity: 0.6;">${c.created_at.slice(0, 16)}</td>
                <td class="kzyc-nowrap">
                  ${c.status === 'pending' ? `<button class="kzyc-adm-btn success" onclick="moderateComment(${c.id}, 'approved')">通过</button>` : `<button class="kzyc-adm-btn warn" onclick="moderateComment(${c.id}, 'pending')">待审</button>`}
                  <button class="kzyc-adm-btn danger" onclick="deleteComment(${c.id})">删除</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div id="kzyc-comm-pagination-container">
        ${renderPaginationHTML(commCurrentPage, filteredComments.length, COMM_PAGE_SIZE, "gotoCommPage")}
      </div>
    `;
  }

  window.filterCommentsStatus = function(st) {
    commFilterStatus = st;
    commCurrentPage = 1;
    applyCommentFilter();
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawCommentsTable(panel);
  };

  window.gotoCommPage = function(p) {
    const totalPages = Math.ceil(filteredComments.length / COMM_PAGE_SIZE) || 1;
    if (isNaN(p) || p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    commCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawCommentsTable(panel);
  };

  window.moderateComment = async function(id, status) {
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/comments/moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ comment_id: id, status })
    });
    
    const target = allComments.find(c => c.id === id);
    if (target) target.status = status;
    const pendingCount = allComments.filter(c => c.status === "pending").length;
    updatePendingBadge(pendingCount);
    applyCommentFilter();
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawCommentsTable(panel);
    refreshAdminStats();
  };

  window.deleteComment = async function(id) {
    if (!confirm("确定要彻底删除这条评论吗？相关楼中楼回复也会一并删除！")) return;
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/comments/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ comment_id: id })
    });
    
    allComments = allComments.filter(c => c.id !== id && c.parent_id !== id);
    const pendingCount = allComments.filter(c => c.status === "pending").length;
    updatePendingBadge(pendingCount);
    applyCommentFilter();
    const totalPages = Math.ceil(filteredComments.length / COMM_PAGE_SIZE) || 1;
    if (commCurrentPage > totalPages) commCurrentPage = totalPages;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawCommentsTable(panel);
    refreshAdminStats();
  };

  // 7. VIP 会员套餐价格与权益管理
  async function renderVipConfigTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取会员套餐与权益配置...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/vip-config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const pricing = data.pricing || {};
      const vip = pricing.vip || {};
      const svip = pricing.svip || {};

      const defaultPriv = {
        user: ["✅ 每天限下载 3 篇资源", "✅ 支持公开软件下载", "❌ 无权下载会员专享资源", "❌ 社区互动基础权益"],
        vip: ["🚀 每天限下载 10 篇资源", "🔓 尊享全站【会员专享】资源", "🔑 畅享专属高速网盘与解压码", "💬 专属标准会员身份徽标"],
        svip: ["⚡ 每天限下载 20 篇海量资源", "🌟 全站所有资源任意无限畅下", "👑 专属至尊超级会员高贵徽标", "🤝 优先资源更新与技术答疑"]
      };
      const priv = data.privileges || defaultPriv;
      const uLines = ((priv.user && priv.user.length) ? priv.user : defaultPriv.user).join("\n");
      const vLines = ((priv.vip && priv.vip.length) ? priv.vip : defaultPriv.vip).join("\n");
      const sLines = ((priv.svip && priv.svip.length) ? priv.svip : defaultPriv.svip).join("\n");

      const v1m = (vip["1m"] && vip["1m"].amount) || "1.90";
      const v3m = (vip["3m"] && vip["3m"].amount) || "3.90";
      const v6m = (vip["6m"] && vip["6m"].amount) || "6.90";
      const v1y = (vip["1y"] && vip["1y"].amount) || "9.90";
      const vForever = (vip["forever"] && vip["forever"].amount) || "88.00";

      const s1m = (svip["1m"] && svip["1m"].amount) || "5.90";
      const s3m = (svip["3m"] && svip["3m"].amount) || "6.90";
      const s6m = (svip["6m"] && svip["6m"].amount) || "9.90";
      const s1y = (svip["1y"] && svip["1y"].amount) || "19.90";
      const sForever = (svip["forever"] && svip["forever"].amount) || "168.00";

      panel.innerHTML = `
        <div style="font-weight: 800; font-size: 1.05rem; margin-bottom: 14px;">💎 VIP 会员套餐价格与前台配置</div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <!-- 标准会员价格设置 -->
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; color: #2563eb; font-size: 0.95rem; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
              <span>💎</span> 标准会员 (VIP) 阶梯价格
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">1 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-vip-1m" value="${v1m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">3 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-vip-3m" value="${v3m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">6 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-vip-6m" value="${v6m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">1 年 / 12个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-vip-1y" value="${v1y}" type="number" step="0.01" />
              </div>
            </div>
            <div style="margin-top: 10px;">
              <label style="font-size: 0.78rem; font-weight: 600;">永久会员 (元)</label>
              <input class="kzyc-adm-input" id="cfg-vip-forever" value="${vForever}" type="number" step="0.01" />
            </div>
          </div>

          <!-- 超级会员价格设置 -->
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; color: #c026d3; font-size: 0.95rem; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
              <span>👑</span> 超级会员 (SVIP) 阶梯价格
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">1 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-svip-1m" value="${s1m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">3 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-svip-3m" value="${s3m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">6 个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-svip-6m" value="${s6m}" type="number" step="0.01" />
              </div>
              <div>
                <label style="font-size: 0.78rem; font-weight: 600;">1 年 / 12个月 (元)</label>
                <input class="kzyc-adm-input" id="cfg-svip-1y" value="${s1y}" type="number" step="0.01" />
              </div>
            </div>
            <div style="margin-top: 10px;">
              <label style="font-size: 0.78rem; font-weight: 600;">永久超级会员 (元)</label>
              <input class="kzyc-adm-input" id="cfg-svip-forever" value="${sForever}" type="number" step="0.01" />
            </div>
          </div>
        </div>

        <!-- 3大卡片专属权益列表多行编辑区 -->
        <div style="font-weight: 800; font-size: 1rem; margin: 24px 0 10px 0;">📋 三大卡片专属权益列表编辑 (每行一条)</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; font-size: 0.86rem; margin-bottom: 8px;">🌐 普通用户权益 (每行一条)</div>
            <textarea class="kzyc-adm-input" id="cfg-priv-user" style="min-height: 125px; font-size: 0.8rem; line-height: 1.6;">${escapeHTML(uLines)}</textarea>
          </div>
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; color: #2563eb; font-size: 0.86rem; margin-bottom: 8px;">💎 标准会员权益 (每行一条)</div>
            <textarea class="kzyc-adm-input" id="cfg-priv-vip" style="min-height: 125px; font-size: 0.8rem; line-height: 1.6;">${escapeHTML(vLines)}</textarea>
          </div>
          <div class="kzyc-adm-form-card" style="margin-bottom: 0;">
            <div style="font-weight: 700; color: #c026d3; font-size: 0.86rem; margin-bottom: 8px;">👑 超级会员权益 (每行一条)</div>
            <textarea class="kzyc-adm-input" id="cfg-priv-svip" style="min-height: 125px; font-size: 0.8rem; line-height: 1.6;">${escapeHTML(sLines)}</textarea>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="kzyc-adm-btn primary" id="kzyc-save-vip-cfg-btn" style="padding: 10px 28px; font-size: 0.92rem;">
            💾 保存并实时同步到前台与支付接口
          </button>
        </div>
      `;

      document.getElementById("kzyc-save-vip-cfg-btn")?.addEventListener("click", async () => {
        const uArr = document.getElementById("cfg-priv-user").value.split("\n").map(s => s.trim()).filter(Boolean);
        const vArr = document.getElementById("cfg-priv-vip").value.split("\n").map(s => s.trim()).filter(Boolean);
        const sArr = document.getElementById("cfg-priv-svip").value.split("\n").map(s => s.trim()).filter(Boolean);

        const payload = {
          pricing: {
            vip: {
              "1m": { amount: (parseFloat(document.getElementById("cfg-vip-1m").value) || 1.9).toFixed(2), name: "标准会员 (1个月)" },
              "3m": { amount: (parseFloat(document.getElementById("cfg-vip-3m").value) || 3.9).toFixed(2), name: "标准会员 (3个月)" },
              "6m": { amount: (parseFloat(document.getElementById("cfg-vip-6m").value) || 6.9).toFixed(2), name: "标准会员 (6个月)" },
              "1y": { amount: (parseFloat(document.getElementById("cfg-vip-1y").value) || 9.9).toFixed(2), name: "标准会员 (1年)" },
              "forever": { amount: (parseFloat(document.getElementById("cfg-vip-forever").value) || 88).toFixed(2), name: "标准会员 (永久)" }
            },
            svip: {
              "1m": { amount: (parseFloat(document.getElementById("cfg-svip-1m").value) || 5.9).toFixed(2), name: "超级会员 (1个月)" },
              "3m": { amount: (parseFloat(document.getElementById("cfg-svip-3m").value) || 6.9).toFixed(2), name: "超级会员 (3个月)" },
              "6m": { amount: (parseFloat(document.getElementById("cfg-svip-6m").value) || 9.9).toFixed(2), name: "超级会员 (6个月)" },
              "1y": { amount: (parseFloat(document.getElementById("cfg-svip-1y").value) || 19.9).toFixed(2), name: "超级会员 (1年)" },
              "forever": { amount: (parseFloat(document.getElementById("cfg-svip-forever").value) || 168).toFixed(2), name: "超级会员 (永久)" }
            }
          },
          privileges: {
            user: uArr.length > 0 ? uArr : defaultPriv.user,
            vip: vArr.length > 0 ? vArr : defaultPriv.vip,
            svip: sArr.length > 0 ? sArr : defaultPriv.svip
          }
        };

        const sRes = await fetch(`${API_BASE}/api/admin/vip-config/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const sData = await sRes.json();
        if (sData.success) {
          alert(sData.message || "VIP 价格与权益配置保存成功！");
          renderVipConfigTab(panel);
        } else {
          alert(sData.error || "保存失败");
        }
      });

    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取 VIP 配置失败：${err.message}</div>`;
    }
  }

  // 6. 敏感词库
  async function renderWordsTab(panel) {
    panel.innerHTML = `<div style="text-align: center; padding: 20px; opacity: 0.6;">正在读取敏感词库...</div>`;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE}/api/admin/sensitive-words`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      allWords = data.words || [];
      filteredWords = allWords;
      wordCurrentPage = 1;
      drawWordsContent(panel);
    } catch (err) {
      panel.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">读取敏感词库失败：${err.message}</div>`;
    }
  }

  function drawWordsContent(panel) {
    const token = localStorage.getItem(TOKEN_KEY);
    const startIdx = (wordCurrentPage - 1) * WORD_PAGE_SIZE;
    const pageItems = filteredWords.slice(startIdx, startIdx + WORD_PAGE_SIZE);

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
        <div style="font-weight: 700; font-size: 0.95rem;">🧹 违规敏感词库（共 ${allWords.length} 个词）</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <input class="kzyc-search-input" id="kzyc-word-search-input" placeholder="🔍 检索词库中关键词..." style="width: 180px;" />
          <span style="font-size: 0.8rem; opacity: 0.6;">当前展示: ${pageItems.length} 项</span>
        </div>
      </div>

      <div class="kzyc-adm-form-card" style="display: flex; gap: 10px; align-items: center;">
        <input class="kzyc-adm-input" id="kzyc-inp-word" placeholder="输入敏感词汇，支持用逗号、顿号、空格批量粘贴输入..." style="margin: 0; flex: 1;" />
        <button class="kzyc-adm-btn primary" id="kzyc-add-word-btn" style="padding: 8px 16px;">➕ 添加敏感词</button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; min-height: 50px;">
        ${pageItems.length === 0 ? '<div style="opacity: 0.5; padding: 10px 0;">暂无匹配的敏感词</div>' : pageItems.map(w => `
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(127,127,127,0.08); border: 1px solid rgba(127,127,127,0.18); border-radius: 6px; font-size: 0.82rem;">
            ${escapeHTML(w.word)}
            <button onclick="deleteWord(${w.id})" title="删除该词" style="border: none; background: none; color: #ef4444; font-weight: bold; cursor: pointer; padding: 0 2px;">✕</button>
          </span>
        `).join('')}
      </div>

      <div id="kzyc-words-pagination-container">
        ${renderPaginationHTML(wordCurrentPage, filteredWords.length, WORD_PAGE_SIZE, "gotoWordPage")}
      </div>
    `;

    const searchInput = document.getElementById("kzyc-word-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const q = e.target.value.trim().toLowerCase();
        filteredWords = allWords.filter(w => w.word && w.word.toLowerCase().includes(q));
        wordCurrentPage = 1;
        drawWordsContent(panel);
        const newInp = document.getElementById("kzyc-word-search-input");
        if (newInp) {
          newInp.value = e.target.value;
          newInp.focus();
        }
      });
    }

    document.getElementById("kzyc-add-word-btn")?.addEventListener("click", async () => {
      const rawText = document.getElementById("kzyc-inp-word").value.trim();
      if (!rawText) return;

      const wordsList = rawText.split(/[,，、;\s\n\r]+/).map(w => w.trim()).filter(Boolean);
      if (wordsList.length === 0) return;

      const addBtn = document.getElementById("kzyc-add-word-btn");
      addBtn.disabled = true;

      for (let i = 0; i < wordsList.length; i++) {
        const word = wordsList[i];
        addBtn.textContent = `添加中 (${i + 1}/${wordsList.length})...`;
        try {
          await fetch(`${API_BASE}/api/admin/sensitive-words/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ word })
          });
        } catch {}
      }

      document.getElementById("kzyc-inp-word").value = "";
      renderWordsTab(panel);
    });
  }

  window.gotoWordPage = function(p) {
    const totalPages = Math.ceil(filteredWords.length / WORD_PAGE_SIZE) || 1;
    if (isNaN(p) || p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    wordCurrentPage = p;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawWordsContent(panel);
  };

  window.deleteWord = async function(id) {
    const token = localStorage.getItem(TOKEN_KEY);
    await fetch(`${API_BASE}/api/admin/sensitive-words/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    });
    
    allWords = allWords.filter(w => w.id !== id);
    filteredWords = filteredWords.filter(w => w.id !== id);
    const totalPages = Math.ceil(filteredWords.length / WORD_PAGE_SIZE) || 1;
    if (wordCurrentPage > totalPages) wordCurrentPage = totalPages;
    const panel = document.getElementById("kzyc-adm-panel");
    if (panel) drawWordsContent(panel);
  };

  // 立即执行 + 页面就绪双重保障
  window.checkAdminAuth = checkAdminAuth;
  checkAdminAuth();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAdminAuth);
  }
  if (typeof document$ !== "undefined") {
    document$.subscribe(checkAdminAuth);
  }

  // 轮询保活
  let retryCount = 0;
  const pollTimer = setInterval(() => {
    retryCount++;
    const loadingEl = document.getElementById("kzyc-admin-loading-tip");
    if (loadingEl) {
      checkAdminAuth();
    } else {
      clearInterval(pollTimer);
    }
    if (retryCount >= 10) clearInterval(pollTimer);
  }, 250);
})();
</script>