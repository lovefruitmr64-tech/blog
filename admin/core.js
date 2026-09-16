
// 显式挂载核心公共工具到 window
window.escapeHTML = escapeHTML;
window.renderPaginationHTML = renderPaginationHTML;
window.updatePendingBadge = updatePendingBadge;
window.refreshAdminStats = refreshAdminStats;
window.switchTab = switchTab;
// ============================================================
// 站长管理后台 - 核心控制中心 (Core)
// 包含：身份鉴权、导航布局、数据大盘四维概览、全局工具函数与生命周期
// ============================================================

window.API_BASE = "https://auth.kzyc.de5.net";
window.TOKEN_KEY = "kzyc_token";

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
          <button class="kzyc-adm-tab" data-tab="categories">🏷️ 分类与导航</button>
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

    if (tab === "overview") (window.renderOverviewTab || renderOverviewTab)(panel);
    if (tab === "orders") (window.renderOrdersTab || renderOrdersTab)(panel);
    if (tab === "resources") (window.renderResourcesTab || renderResourcesTab)(panel);
    if (tab === "banners") (window.renderBannersTab || renderBannersTab)(panel);
    if (tab === "comments") (window.renderCommentsTab || renderCommentsTab)(panel);
    if (tab === "users") (window.renderUsersTab || renderUsersTab)(panel);
    if (tab === "vip-config") (window.renderVipConfigTab || renderVipConfigTab)(panel);
        if (tab === "words") (window.renderWordsTab || renderWordsTab)(panel);
        if (tab === "categories") {
      const renderFn = window.renderCategoriesTab || (typeof renderCategoriesTab === 'function' ? renderCategoriesTab : null);
      if (renderFn) {
        renderFn(panel);
      } else {
        panel.innerHTML = '<div style="padding: 40px; text-align: center; color: #ef4444;">⏳ 正在加载分类与导航模块，请稍候...</div>';
      }
    }
  }

  // 1. 数据看板 (集成全站运营指标 + VIP 收入四维统计)
  function renderOverviewTab(panel) {
    const stats = adminStats || {};
    panel.innerHTML = `
      <div style="font-weight: 800; font-size: 0.98rem; margin-bottom: 12px; color: #1e40af;">💰 VIP 财务收入四维看板</div>
      <div class="kzyc-rev-grid">
        <div class="kzyc-rev-card today">
          <div class="kzyc-rev-title">📅 今日收入</div>
          <div class="kzyc-rev-num">¥ ${parseFloat(stats.today_revenue || 0).toFixed(2)}</div>
          <div class="kzyc-rev-sub">今日付款：${stats.today_paid_orders || 0} 笔</div>
        </div>
        <div class="kzyc-rev-card month">
          <div class="kzyc-rev-title">🗓️ 本月收入</div>
          <div class="kzyc-rev-num">¥ ${parseFloat(stats.month_revenue || 0).toFixed(2)}</div>
          <div class="kzyc-rev-sub">本月累计到账</div>
        </div>
        <div class="kzyc-rev-card year">
          <div class="kzyc-rev-title">📆 本年收入</div>
          <div class="kzyc-rev-num">¥ ${parseFloat(stats.year_revenue || 0).toFixed(2)}</div>
          <div class="kzyc-rev-sub">年度总业绩</div>
        </div>
        <div class="kzyc-rev-card total">
          <div class="kzyc-rev-title">💎 历史累计总收入</div>
          <div class="kzyc-rev-num">¥ ${parseFloat(stats.total_revenue || 0).toFixed(2)}</div>
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

window.renderOverviewTab = renderOverviewTab;
